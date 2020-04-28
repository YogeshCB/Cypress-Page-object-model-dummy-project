import config from "../config";
import { isUndefined } from "@bit/kubric.utils.common.lodash";

export const getMediaTime = timeInSecs => {
  let durStr = '00:00';
  if (timeInSecs) {
    durStr = '';
    const duration = Math.floor(timeInSecs);
    let hours = Math.floor(duration / 3600);
    hours > 0 && (durStr += ((hours < 10 ? '0' : '') + hours + ':'));
    let secsLeft = duration - (hours * 3600);
    let minutes = Math.floor(secsLeft / 60);
    let secs = secsLeft - (minutes * 60);
    durStr += ((minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs);
  }
  return durStr.replace(/^0/, '');
};

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const isValidEmail = email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

export const isValidURL = url => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(url);

export const postData = (url, { responseHandler, data }) => {
  const req = new XMLHttpRequest();
  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  responseHandler && req.addEventListener('load', responseHandler.bind(null, req));
  req.send(JSON.stringify(data));
};

export const isMobile = () => !isUndefined(__kubric_config__) && __kubric_config__.isMobile;

export const getCurrentRoot = () => !isUndefined(__kubric_config__) && __kubric_config__.root;

export const isPrefetched = datakey => !isUndefined(__kubric_data__) && !!__kubric_data__[datakey];

export const isKubricUser = email => /@kubric\.io$/.test(email);

export const getPrefetched = dataKey => {
  let returnData;
  if (!isUndefined(__kubric_data__)) {
    returnData = __kubric_data__[dataKey];
  }
  return returnData;
};

export const clearPrefetched = datakey => {
  let returnData;
  if (!isUndefined(__kubric_data__)) {
    returnData = __kubric_data__[datakey];
    delete __kubric_data__[datakey];
  }
  return returnData;
};

export const getTimeStamp = () => new Date().getTime();

export const getFileKey = (file, path = '') => `${path}/${file.name}_${getTimeStamp()}`.replace(/\./g, "_");

export const getFileAcceptTypes = (types, asSet = false) => {
  const arr = types.split(',');
  const acceptingTypes = arr.reduce((acc, type) => {
    const extensions = config.fileAcceptTypes[type] || [];
    return [...acc, ...extensions];
  }, []);
  return asSet ? new Set(acceptingTypes) : acceptingTypes.join(',');
};

export const getFileExtension = file => `.${file.name.split('.').pop()}`;

export const mergeObjectArrays = (arr1 = [], arr2 = []) =>
  arr2.map((arr2Object, index) => ({
    ...arr2Object,
    ...arr1[index]
  }));