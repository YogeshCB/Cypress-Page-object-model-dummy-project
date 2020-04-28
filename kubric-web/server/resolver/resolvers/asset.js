import _ from "lodash";
import logger from '../../lib/logger';
import services from '../../services';
import { resolveAllPromise } from "../../../isomorphic/promise";

const avMapper = ({ asset_type, length: duration, url }) => ({
  type: asset_type,
  duration,
  url,
});

const assetValueMapper = {
  audio: avMapper,
  "video,audio": avMapper,
};

const resolveAssetResult = (type, asset) => assetValueMapper[type] ? assetValueMapper[type](asset) : asset.url;

const getConstraintString = (obj = {}) => Object.keys(obj).reduce((acc, key) => `${acc},${key}:${obj[key]}`, '');

const parseEditorMeta = ({ tags = [], attributes = {}, ...editorMeta } = {}) => ({
  q: tags.join(','),
  attributes: getConstraintString(attributes),
  constraints: getConstraintString(editorMeta)
});

const resolveAssets = (assetType, { meta = {}, privateAssets = true, editorMeta = {} }, attrMap, email, token, workspace_id, defaultValue) => {
  let { constraints = '', q = '', attributes = '' } = parseEditorMeta(editorMeta);
  const { colId: attrName } = meta;
  const columnValue = attrMap[attrName];
  if ((_.isUndefined(columnValue) || columnValue.length === 0) && q.length === 0) {
    const asset = _.isString(defaultValue) ? {
      url: defaultValue
    } : defaultValue;
    const parsedAsset = resolveAssetResult(assetType, asset);
    return Promise.resolve({
      value: parsedAsset,
      meta: asset
    });
  } else {
    let query = `${q}${!_.isUndefined(columnValue) ? `,${columnValue}` : ''}`.replace(/^,|,$/g, "");
    constraints = constraints.replace(/^,|,$/g, "");
    const serviceData = {
      token,
      type: assetType,
      q: query,
      workspace_id
    };
    if (privateAssets) {
      serviceData.userId = email;
    }
    if (constraints.length > 0) {
      serviceData.constraints = constraints;
    }
    if (attributes.length > 0) {
      serviceData.attributes = attributes;
    }

    return new Promise(resolve => {
      let retries = 0;

      const fireService = () =>
        services.assets
          .get().send(serviceData)
          .then(({ hits = [] }) => {
            const assets = hits.map(resolveAssetResult.bind(null, assetType));
            resolve({
              value: assets[0],
              meta: hits[0]
            });
          })
          .catch(error => {
            logger.error("Asset resolution erred");
            logger.error(error);
            const errorObject = {
              __hasErred__: true,
              __status__: error.status,
              __url__: error.response.request.url,
              __parametrized__: true,
              __column__: meta,
              __constraints__: constraints
            };
            if (error.status === 404) {
              resolve({
                ...errorObject,
                __message__: 'Missing asset',
              });
            } else if (retries < 3) {
              retries++;
              logger.error(`Retrying... ${retries}`);
              setTimeout(fireService, 1000);
            } else {
              logger.error("No more retries for asset resolution");
              resolve({
                ...errorObject,
                __message__: 'Unable to retrieve after 3 retries'
              });
            }
          });

      fireService();
    });
  }
};

const resolveParameter = (assetType, parameter, attrMap, userId, token, workspace) =>
  new Promise((resolve, reject) => {
    const { default: defaultValue, shouldParametrize } = parameter;
    try {
      if (shouldParametrize) {
        resolveAssets(assetType, parameter, attrMap, userId, token, workspace, defaultValue)
          .then(resolve);
      } else {
        resolve(defaultValue);
      }
    } catch (ex) {
      logger.error(ex);
      reject(ex);
    }
  });

export default (assetType, parameter, attrMap, userId, token, workspace) => {
  const { bindings, default: defaultValue } = parameter;
  try {
    if (_.isUndefined(bindings)) {
      return resolveParameter(assetType, parameter, attrMap, userId, token, workspace);
    } else {
      const isArray = Array.isArray(defaultValue);
      const promises = Object.keys(bindings).reduce((acc, key) => {
        acc[key] = resolveParameter(assetType, bindings[key], attrMap, userId, token, workspace);
        return acc;
      }, isArray ? [] : {});
      return (isArray ? Promise.all(promises) : resolveAllPromise(promises))
        .then(resp => {
          let finalResponse = {};
          if (Array.isArray(defaultValue)) {
            finalResponse = [];
          }
          let counter = 0;
          const keys = Object.keys(resp);
          keys.reduce((acc, key) => {
            let currentResp = resp[key] || bindings[key].default;
            if (Array.isArray(currentResp)) {
              currentResp = currentResp[counter];
              if (_.isUndefined(currentResp)) {
                [currentResp] = _.at(bindings, `${key}.default.${counter}`);
                if (_.isUndefined(currentResp)) {
                  currentResp = defaultValue[key];
                }
              }
              counter++;
            }
            if (_.isString(currentResp)) {
              currentResp = currentResp.replace('=s200-c', '');
            }
            acc[key] = currentResp;
            return acc;
          }, finalResponse);
          return finalResponse;
        });
    }
  } catch (ex) {
    logger.error(ex);
    reject(ex);
  }
};