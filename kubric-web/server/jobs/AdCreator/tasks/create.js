import services from '../../../services';
import logger from '../../../lib/logger';
import { resolveBindings } from "../../../api/resolver";
import { campaignStatus } from "../../../../isomorphic/constants/queue";
import { updateProgress } from "./setup";
import _ from "lodash";
import { stringifyJson } from "../../../../isomorphic/utils";
import { statuses } from "../../../../isomorphic/constants/creatives";
import Resolver from "@bit/kubric.utils.common.json-resolver";
import { taskPoll } from "../../utils";

const BATCH_LIMIT = 20;
export const extractFromParameters = (resolutionResults = {}, field) => resolutionResults.map(result => result[field] || {});

export const resolveAd = async ({ bindings, email, token, workspace }, segment, bindingIndex, { meta = {} } = {}) => {
  bindings = JSON.parse(bindings);
  const { hasErred, results: resolutionResults } = await resolveBindings(bindings[bindingIndex], segment, email, token, workspace);
  const status = !hasErred ? statuses.CREATION_COMPLETED : statuses.CREATION_ERRED;
  meta = _.isString(meta) ? stringifyJson(meta, {}) : meta;
  meta = {
    ...meta,
    assets: extractFromParameters(resolutionResults, 'meta'),
    editorMeta: extractFromParameters(resolutionResults, 'editorMeta')
  };
  if (hasErred) {
    meta = {
      ...meta,
      message: "Asset resolution failed",
      errors: extractFromParameters(resolutionResults, 'errors')
    };
  }
  return {
    meta,
    status,
    parameters: extractFromParameters(resolutionResults, 'results'),
    hasErred
  };
};

export const resolveSuggestions = async ({ bindings, email, token, workspace }, parameters = [], bindingIndex) => {
  const resolver = new Resolver();

  const getSuggestRequests = (bindings, parameters) => Object.keys(bindings)
    .reduce((acc, key) => {
      const binding = bindings[key];
      const { editorMeta = {}, bindings: subBindings = [] } = binding;
      const { suggest } = editorMeta;
      if (!_.isUndefined(suggest)) {
        acc.requests.push(resolver.resolve(suggest.request || {}, parameters));
        acc.patches.push(suggest.patch || {});
      }
      if (subBindings.length > 0) {
        const { requests = [], patches = [] } = getSuggestRequests(subBindings);
        acc = {
          requests: [
            ...acc.requests,
            ...requests
          ],
          patches: [
            ...acc.patches,
            ...patches
          ]
        };
      }
      return acc;
    }, {
      requests: [],
      patches: []
    });

  return await Promise.all(JSON.parse(bindings)[bindingIndex]
    .map(async (shotBinding, shotIndex) => {
      const shotParameters = parameters[shotIndex];
      const suggestRequests = getSuggestRequests(shotBinding, shotParameters);
      const { requests = [], patches = [] } = suggestRequests;
      const { task_id: taskId } = await services.suggest.getSuggestions()
        .send({
          token,
          workspace,
          data: requests
        });
      return await new Promise(resolve => {
        taskPoll({ token, taskId }, (emitter, task) => {
          let { status, result: results } = task;
          //result can be null
          results = results || [];
          if (status === -1) {
            emitter.clear();
            console.error("Task polling failed for auto suggest resolution");
            resolve([]);
          } else if (status === 1) {
            emitter.clear();
            resolve(results);
          }
        }, () => resolve([]));
      })
        .then(results => {
          if (results.length > 0) {
            return results.reduce((acc, result, index) => {
              if (result.__error__) {
                return acc;
              } else {
                return ({
                  ...acc,
                  ...resolver.resolve(patches[index], result)
                });
              }
            }, { ...shotParameters });
          } else {
            return shotParameters;
          }
        });
    }));
};

export default async (data, progress, resolve, reject) => {
  let { token, ssData = '[]', campaignId, workspace, source = '[]', mediaFormat = "video", _progressStats: stats, preprocess = false } = data;
  source = JSON.parse(source);
  const ssRows = JSON.parse(ssData);
  let runningStats = { ...stats };
  const progressUpdater = updateProgress(progress);
  let hasErred = false;
  const auth = {
    token,
    workspace_id: workspace
  };
  const { type: sourceType, data: storyboards = [] } = source;
  const shouldSuffix = storyboards.length > 1;
  let sbNames = {};
  if (sourceType === 'storyboards' && shouldSuffix) {
    sbNames = await services.storyboards
      .getBulk()
      .send({
        ...auth,
        ids: storyboards.map(({ id, version }) => `${id}:${version}`)
      })
      .then(({ data = [] }) => data.reduce((acc, { uid, name }) => {
        acc[uid] = name;
        return acc;
      }, {}));
  }
  const createAd = ({ orgData = {}, inferredData, validationErrors, storyboard, ...segment },
                    meta = {}, parameters = {}, status = campaignStatus.CREATION_PENDING) => {
    const { assigned_to } = segment;
    const serviceData = {
      ...auth,
      campaign: campaignId,
      status,
      mediaFormat,
      source: {
        parameters,
        segment: {
          ...segment,
          attributes: segment.attributes.map(({ name, value }) => ({
            name,
            value,
            display_name: name,
            type: "string"
          }))
        },
        orgData
      },
      meta: {
        ...meta,
        inferredData,
        validationErrors
      },
    };
    if (!_.isUndefined(assigned_to)) {
      serviceData.assigned_to = assigned_to;
    }
    if (_.isUndefined(storyboard)) {
      serviceData.source.templates = source;
    } else {
      const { id, version, index } = storyboard;
      serviceData.storyboardId = id;
      serviceData.storyboardVersion = version;
      serviceData.source.bindingIndex = index;
      if (shouldSuffix) {
        serviceData.source.segment.name = `${segment.name} - ${sbNames[id]}`;
      }
    }
    return services.campaign
      .saveAd()
      .send(serviceData)
      .then(response => {
        runningStats = progressUpdater(runningStats);
        return response;
      });
  };

  const createAds = rows =>
    Promise.all(rows.map(row => {
      const { orgData = {}, inferredData, validationErrors, storyboard = {}, ...segment } = row;
      const { index = 0 } = storyboard;
      if (!preprocess) {
        return resolveAd(data, segment, index)
          .then(({ meta, parameters, status, hasErred: hasResolutionFailed }) => {
            if (!hasErred && (!_.isUndefined(validationErrors) || hasResolutionFailed)) {
              hasErred = true;
            }
            return resolveSuggestions(data, parameters, index)
              .then(suggestedParameters => createAd(row, meta, suggestedParameters, status));
          });
      } else {
        return createAd(row)
      }
    }));

  const adCreator = (ssRows = []) =>
    createAds(ssRows.splice(0, BATCH_LIMIT))
      .then(() => {
        if (ssRows.length > 0) {
          return adCreator(ssRows);
        } else {
          return services.campaigns.save()
            .send({
              ...auth,
              campaignId,
              status: hasErred ? campaignStatus.CREATION_ERRED : (preprocess ? campaignStatus.CREATION_PENDING : campaignStatus.CREATION_COMPLETED)
            });
        }
      })
      .then(() => {
        progressUpdater.flush();
        resolve()
      })
      .catch(ex => {
        logger.error(ex);
        progressUpdater.flush();
        reject(ex);
      });

  adCreator(ssRows);
}