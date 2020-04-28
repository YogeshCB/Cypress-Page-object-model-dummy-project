import creatorConfig from './creator';
import adminConfig from './admin';
import { at, intersection, arrayToMap } from '@bit/kubric.utils.common.lodash';

let roleMap = {
  creator: creatorConfig,
  admin: adminConfig,
};

const getFields = (typeArr, roleConfig, formName, resultsObj = {}) => {
  for (let i = 0; i < typeArr.length; i++) {
    let type = typeArr[i];
    let current = resultsObj[type] || [];
    let [fields] = at(roleConfig, formName + '.' + type);
    if (fields) {
      current.push(fields);
    }
    resultsObj[type] = current;
  }
  return resultsObj;
};

const intersect = resultsObj => {
  for (let i in resultsObj) {
    resultsObj[i] = arrayToMap(intersection(resultsObj[i]));
  }
  return resultsObj;
};

export const getAuthorizationRules = (roles, formName) => {
  if (!roles || !formName) {
    throw new Error('Invalid value passed for roles or formName parameters');
  } else {
    let resultsObj = {
      restrictedFields: [],
      lockedFields: [],
    };
    for (let i in roles) {
      let roleConfig = roleMap[i];
      resultsObj = getFields(['restrictedFields', 'lockedFields'], roleConfig, formName, resultsObj);
    }
    resultsObj = intersect(resultsObj);
    return resultsObj;
  }
};
