import { isFunction, isObject, isUndefined } from "@bit/kubric.utils.common.lodash";

export default class {
  constructor(parameters = []) {
    if (!Array.isArray(parameters)) {
      parameters = [parameters];
    }
    this.parameters = parameters;
  }

  _iterator(cb) {
    this.parameters.forEach((params, index) => {
      const prefix = `s${index + 1}/`;
      Object.keys(params).forEach(paramName => {
        let { default: defaultValue, composite: isComposite, length, type } = params[paramName];
        const eventData = {
          type,
          index,
          id: paramName,
          parameter: params[paramName]
        };
        let paramKey = `${prefix}${paramName.toLowerCase()}`;
        if (!isUndefined(length) && !isComposite) {
          length = +length;
          if (!isNaN(length)) {
            for (let i = 0; i < length; i++) {
              cb(`${paramKey}/${i + 1}`, defaultValue[i], { key: i, ...eventData });
            }
          }
        } else if (isObject(defaultValue) && !isComposite) {
          Object.keys(defaultValue).forEach(key => cb(`${paramKey}/${key}`, defaultValue[key], { key, ...eventData }));
        } else {
          cb(paramKey, defaultValue, { composite: isComposite, ...eventData });
        }
      });
    });
  }

  iterate(options = {}) {
    const { reduce = false, results = {}, cb } = options;
    if (reduce) {
      this._iterator((paramKey, defaultValue) => results[paramKey] = defaultValue);
      return results;
    } else if (isFunction(cb)) {
      this._iterator(cb);
    }
  }
}