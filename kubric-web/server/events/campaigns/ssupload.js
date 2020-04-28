import SocketFileUpload from "socketio-file-upload";
import logger from "../../lib/logger";
import { campaignEvents, connections, errorEvents, rooms } from "../../../isomorphic/sockets";
import Resolver from '@bit/kubric.utils.common.json-resolver';
import config from "config";
import lineCount from 'linecount/promise';
import { parseCSV } from "../../api/utils";
import _ from "lodash";
import { stringifyJson } from "../../../isomorphic/utils";
import adCreationJob from "../../jobs/AdCreator";
import services from "../../services";
import fs from 'fs';
import featureGates from '../../lib/featuregates';
import { fgNames } from "../../../isomorphic/constants/featuregates";
import rimraf from 'rimraf';

const SSWORKSPACE = config.get('paths.spreadsheets');

const nonAttributes = new Set(['aud_id', 'name', 'fb_id', 'assigned_to']);

const parse = async (file, updateProgress, emit, data = {}) => {
  let processed = 0;
  try {
    const ssData = await parseCSV(file, {
      hasHeaders: true,
      ignoreEmptyFields: false,
      transform(rowData, headers) {
        const keys = Object.keys(rowData);
        const orgData = [];
        const firstColumnValue = rowData[headers[0]];
        rowData.attributes = keys.filter((value, i) => !_.isUndefined(value) && value.length > 0 && !nonAttributes.has(keys[i]))
          .reduce((acc, key) => {
            let currentValue = rowData[key];
            if (!_.isUndefined(currentValue)) {
              currentValue = currentValue.replace(/\\n/g, "\n");
              acc.push({
                name: key,
                value: currentValue,
              });
              delete rowData[key];
            }
            orgData.push({
              name: key,
              value: currentValue,
            });
            return acc;
          }, []);
        if (!rowData.aud_id) {
          rowData.aud_id = firstColumnValue;
        }
        if (!rowData.name) {
          rowData.name = firstColumnValue;
        }
        updateProgress(processed++);
        return {
          ...rowData,
          orgData
        };
      },
    });

    const inferenceEnabled = new Set(featureGates.get(fgNames.INFERENCE_ENABLED_WS, []));
    const { campaignId, token, workspace_id: workspace, email, userid: user, preprocess } = data;
    const campaign = await services.campaign
      .get()
      .send({
        campaign: campaignId,
        token,
        workspace_id: workspace
      })
      .then(({ data }) => ({
        ...data,
        bindings: JSON.parse(data.bindings)
      }));

    let { tasks = {}, bindings, mediaFormat, storyboard_ids: storyboards = [], storyboard_versions: sbVersions = [], template } = campaign;
    let source = [];
    if (!_.isUndefined(template)) {
      bindings = [template.bindings];
      source = _.at(template, ["storyboard.0.template"]);
    } else {
      source = {
        type: "storyboards",
        data: storyboards.map((sb, index) => ({
          id: sb,
          version: sbVersions[index] || ''
        }))
      };
    }
    tasks = stringifyJson(tasks, {});
    const { id } = await adCreationJob.add({
      user,
      token,
      email,
      bindings: JSON.stringify(bindings),
      source: JSON.stringify(source),
      workspace,
      preprocess: preprocess && inferenceEnabled.has(workspace),
      ssData: JSON.stringify(ssData),
      mediaFormat,
      campaignId,
      ts: (new Date()).getTime()
    });
    await services.campaigns.save()
      .send({
        token,
        workspace_id: workspace,
        campaignId,
        tasks: {
          ...tasks,
          adcreation: id
        }
      });
    emit(campaignEvents.CSV_PROCESS_COMPLETED, {
      jobId: id
    });
  } catch (ex) {
    logger.error(ex);
    emit(campaignEvents.CSV_PROCESS_ERRED, ex);
  }
};

export default async (socket, sessionCache, io) => {
  const uploader = new SocketFileUpload();
  const resolver = new Resolver();
  let sessionData = {};

  const emit = (file, event, data) => {
    const campaignRoom = resolver.resolve(rooms.CAMPAIGN, file.meta);
    io.of(connections.CAMPAIGN)
      .to(campaignRoom)
      .emit(event, data);
  };

  const fileUploadHandler = e => {
    const { size, bytesLoaded } = e.file;
    emit(e.file, campaignEvents.CSV_UPLOAD_PROGRESSED, {
      size,
      bytesLoaded,
      progressPercent: parseInt(bytesLoaded * 100 / size)
    });
  };

  uploader.on('start', e => {
    logger.info("SS upload started", e.file.bytesLoaded);
    const campaignRoom = resolver.resolve(rooms.CAMPAIGN, e.file.meta);
    socket.join(campaignRoom);
  });

  uploader.on('progress', fileUploadHandler);

  uploader.on('complete', e => {
    logger.info("Upload completed");
    emit(e.file, campaignEvents.CSV_UPLOAD_COMPLETED, e);
  });

  uploader.on('saved', async e => {
    logger.info("SS saved");
    const savedFilename = `${SSWORKSPACE}/${e.file.name}`;
    const { id: campaignId, preprocess, uid } = e.file.meta;
    if (_.isUndefined(uid)) {
      emit(e.file, errorEvents.MISSING_UID);
    } else {
      sessionData = await sessionCache.getSession(uid);
      if (!sessionData) {
        emit(e.file, errorEvents.SESSION_EXPIRED);
      } else {
        lineCount(savedFilename)
          .then(count => {
            const numRows = count - 1;
            logger.info(`Processing ${savedFilename} - ${numRows}`);

            const updateProgress = processed =>
              emit(e.file, campaignEvents.CSV_PROCESS_PROGRESSED, {
                total: numRows,
                processed,
                progressPercent: parseInt(processed * 100 / numRows)
              });

            updateProgress(0);

            parse(fs.createReadStream(savedFilename), updateProgress, emit.bind(null, e.file), {
              campaignId,
              preprocess,
              ...sessionData
            })
              .then(() => rimraf(savedFilename, {
                glob: false
              }, err => {
                if (err) {
                  console.error(`Error while deleting CSV file at ${savedFilename}`);
                }
              }));
          });
      }
    }
  });

  uploader.on('error', e => {
    logger.error("Error", e.message, e.code);
    emit(e.file, campaignEvents.CSV_UPLOAD_ERRED, e);
  });

  uploader.dir = SSWORKSPACE;
  uploader.listen(socket);
};
