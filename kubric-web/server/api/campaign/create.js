import messages from '../../lib/messages';
import services from '../../services';
import _ from 'lodash';
import { responseTransformer, serviceHelper } from "../utils";
import logger from '../../lib/logger';
import { createTemplateSheet } from "../template";

const validate = (req, res, next) => {
  let { name = '', storyboards = [] } = req.body;
  if (_.isString(storyboards)) {
    storyboards = [storyboards];
  }
  req.body.storyboardIds = [];
  req.body.storyboardVersions = [];
  storyboards.reduce((body, { version, id }) => {
    body.storyboardIds.push(id);
    body.storyboardVersions.push(version);
    return body;
  }, req.body);
  req.body.storyboards = storyboards;
  if (!_.isString(name) || name.length === 0 || storyboards.length === 0) {
    res.status(400).send(messages.getResponseMessage(`services.createCampaign.INVALID_REQUEST`));
  } else {
    next();
  }
};

export const extractSBParameters = async (req, res, next) => {
  try {
    const { storyboardIds = [], storyboardVersions = [] } = req.body;
    const ids = storyboardIds.map((id, index) => `${id}:${storyboardVersions[index]}`);
    req._shots = await services.storyboards
      .getBulk()
      .send({
        ...req._sessionData,
        ids
      })
      .then(({ data = [] }) => data.map(({ shots = [] }) => shots));
    next();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.createCampaign.STORYBOARD_FAILED`));
  }
};

const getColId = (paramId, shotId, key) => `s${shotId + 1}/${paramId.toLowerCase().replace(/\s/g, '_')}${_.isUndefined(key) ? '' : `/${key}`}`;

const getColTitle = (paramId, shotId, title, key) => `shot ${shotId + 1}:${title || paramId}${_.isUndefined(key) ? '' : `:${key}`}`;

const parseParameterBindings = (req, res, next) => {
  req._bindings = req._shots.map(shots => {
    let colIndex = 3;
    return shots.map(({ params = {} }, shotId) => Object.keys(params).filter(param => !params[param].hideInSheet).reduce((acc, paramId) => {
      let newParam = { ...params[paramId] };
      const { default: defaultValue, composite: isComposite, title } = newParam;
      if (Array.isArray(defaultValue)) {
        newParam.length = defaultValue.length;
      }
      if (isComposite || (!Array.isArray(defaultValue) && !_.isPlainObject(defaultValue))) {
        newParam.meta = {
          colId: getColId(paramId, shotId),
          colIndex,
          colTitle: getColTitle(paramId, shotId, title)
        };
        if (isComposite) {
          newParam.isComposite = true;
        }
        newParam.shouldParametrize = true;
        colIndex++;
      } else {
        newParam.bindings = Object.keys(newParam.default).reduce((acc, key) => {
          const { default: defaultValue, ...copyParam } = newParam;
          const keyDisplay = Array.isArray(defaultValue) ? (+key + 1) : key;
          acc[key] = {
            ...copyParam,
            title: key,
            shouldParametrize: true,
            default: defaultValue[key],
            meta: {
              colId: getColId(paramId, shotId, keyDisplay),
              colIndex,
              colTitle: getColTitle(paramId, shotId, title, keyDisplay)
            }
          };
          colIndex++;
          return acc;
        }, {});
      }
      acc[paramId] = newParam;
      return acc;
    }, {}))
  });
  next();
};

const createCampaign = (req, res, next) =>
  serviceHelper(res, {
    resource: 'campaigns',
    service: 'save',
    data: {
      ...req._sessionData,
      ...req.body,
      bindings: req._bindings,
    },
    transformer: responseTransformer,
  });

const setupRequest = (req, res, next) => {
  const { storyboard, version } = req.params;
  req.body = {
    storyboardIds: [storyboard],
    storyboardVersions: [version],
  };
  next();
};
const selectFirstBinding = (req, res, next) => {
  req._bindings = req._bindings[0];
  req.params = {
    ...req.params,
    templateId: `${req.params.storyboard}_${req.params.version}`
  };
  next();
};

export default Router => {
  Router.put('/', [
    validate,
    extractSBParameters,
    parseParameterBindings,
    createCampaign
  ]);
  Router.get('/storyboard/:storyboard/:version/sheet.csv', [
    setupRequest,
    extractSBParameters,
    parseParameterBindings,
    selectFirstBinding,
    createTemplateSheet
  ]);
  return Router;
};
