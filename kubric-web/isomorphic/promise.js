import { isObject } from "@bit/kubric.utils.common.lodash";

export const resolveAllPromise = promises => {
  if (Array.isArray(promises)) {
    return Promise.all(promises);
  } else if (isObject(promises)) {
    const keys = Object.keys(promises);
    const promiseArr = [];
    const keyMap = keys.reduce((acc, key, index) => {
      acc[index] = key;
      promiseArr.push(promises[key]);
      return acc;
    }, {});
    return Promise.all(promiseArr)
      .then(respArr => {
        return respArr.reduce((acc, resp, index) => {
          acc[keyMap[index]] = resp;
          return acc;
        }, {});
      });
  } else {
    return promise;
  }
};