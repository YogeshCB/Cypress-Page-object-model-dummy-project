import logger from '../../lib/logger';
import _ from 'lodash';

const getErrorObject = (meta, message, shouldParametrize = false, ssValue, defaultValue) => ({
  __hasErred__: true,
  __column__: meta,
  __message__: message,
  __parametrized__: shouldParametrize,
  __ssValue__: ssValue,
  __defaultValue__: defaultValue
});

const getValue = (meta, shouldParametrize, attrMap, defaultValue) => {
  const attrValue = attrMap[meta.colId];
  const value = shouldParametrize ? (!_.isUndefined(attrValue) ? attrValue : defaultValue) : defaultValue;
  if (_.isUndefined(value)) {
    return getErrorObject(meta, shouldParametrize ? "Value missing in uploaded csv" : "Default value for parameter missing from shot", shouldParametrize, attrValue, defaultValue);
  } else {
    return value;
  }
};

export default ({ default: defaultValue, bindings, shouldParametrize, meta = {} }, attrMap) => new Promise((resolve, reject) => {
  try {
    if (_.isUndefined(bindings)) {
      resolve(getValue(meta, shouldParametrize, attrMap, defaultValue));
    } else {
      const isArray = Array.isArray(defaultValue);
      resolve(Object.keys(bindings).reduce((acc, key) => {
        const { shouldParametrize, meta = {}, default: defaultValue } = bindings[key];
        acc[key] = getValue(meta, shouldParametrize, attrMap, defaultValue);
        return acc;
      }, isArray ? [] : {}))
    }
  } catch (ex) {
    logger.error(ex);
    reject(ex);
  }
});
