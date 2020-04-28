import Express from 'express';
import { serviceHelper, responseTransformer } from "./utils";
import services from "../services";
import _ from "lodash";
import logger from "../lib/logger";
import messages from "../lib/messages";
import csv from 'fast-csv';

const Router = Express.Router();

const saveTemplate = (req, res) => {
  const { id } = req.params;
  const { storyboard, name, bindings } = req.body;
  serviceHelper(res, {
    resource: 'templates',
    service: 'save',
    data: {
      ...req._sessionData,
      id,
      storyboard,
      bindings,
      name,
    },
    transformer: responseTransformer,
  });
};

Router.post('/', saveTemplate);

Router.post('/:id', saveTemplate);

Router.get('/:templateId', (req, res, next) =>
  serviceHelper(res, {
    resource: 'templates',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.params,
    },
    transformer: responseTransformer,
  }));

Router.post('/:templateId/copy', (req, res, next) =>
  serviceHelper(res, {
    resource: 'templates',
    service: 'copy',
    data: {
      ...req._sessionData,
      ...req.params,
      ...req.body,
    },
    transformer: responseTransformer,
  }));

Router.delete('/:templateId', (req, res, next) =>
  serviceHelper(res, {
    resource: 'templates',
    service: 'remove',
    data: {
      ...req._sessionData,
      ...req.params,
    },
    transformer: responseTransformer,
  }));

const extractBindings = async (req, res, next) => {
  try {
    const templateData = await services.templates.get().send({
      ...req._sessionData,
      ...req.params
    });
    req._bindings = _.get(templateData, 'data.bindings', []);
    next();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.segments.DOWNLOAD_FAILED'));
  }
};

export const createTemplateSheet = (req, res, next) => {
  try {
    const bindings = req._bindings;
    const parseBindings = (acc, bindings) =>
      Object.keys(bindings).reduce((acc, paramId) => {
        const currentParameter = bindings[paramId];
        const { bindings: subBindings, default: defaultValue, isComposite, shouldParametrize, meta = {} } = currentParameter;
        if (shouldParametrize) {
          acc[meta.colId] = isComposite ? '' : defaultValue;
        } else if (!_.isUndefined(subBindings)) {
          acc = parseBindings(acc, subBindings);
        }
        return acc;
      }, acc);
    const csvData = bindings.reduce(parseBindings, {
      "aud_id": "1",
      "name": "Default Audience",
      "fb_id": "",
      "assigned_to": ""
    });
    const fileName = `${req.params.templateId}_${Date.now()}.csv`;
    const csvStream = csv.createWriteStream({ headers: true });
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${fileName}`
    });
    csvStream.pipe(res);
    csvStream.write(csvData);
    csvStream.end();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.segments.DOWNLOAD_FAILED'));
  }
};

Router.get('/:templateId/sheet.csv', [extractBindings, createTemplateSheet]);

export default Router;