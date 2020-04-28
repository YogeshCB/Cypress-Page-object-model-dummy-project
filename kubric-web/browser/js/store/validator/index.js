import config from './config';
import store from '../../store';
import { isValidURL } from "../../lib/utils";
import { isUndefined, isNull, isFunction } from '@bit/kubric.utils.common.lodash';

class FormError {
  errorObject = {};
  static errorMessages = {
    'required': "Mandatory field",
    'number': "Please enter a valid number",
    'url': 'Please enter a valid url',
  };

  postError(field, rule, message) {
    let err = this.errorObject[field] || '';
    let ruleError = message || FormError.errorMessages[rule] || rule;
    this.errorObject[field] = `${err ? `${err}; ` : ''}${ruleError}`;
  }

  getData() {
    return this.errorObject;
  }

  hasErred() {
    return Object.keys(this.errorObject).length !== 0;
  }
}

const required = (data, config, errorObj) => {
  for (let i in config) {
    const conf = config[i];
    if (isFunction(conf)) {
      conf(data[i], errorObj.postError.bind(errorObj, i, 'required'));
    } else if (isUndefined(data[i]) || isNull(data[i]) || data[i] === '') {
      errorObj.postError(i, 'required');
    }
  }
};

const number = (data, config, errorObj) => {
  for (let i in config) {
    let number = +data[i];
    if (isNaN(number)) {
      errorObj.postError(i, 'number');
    }
  }
};

const url = (data, config, errorObj) => {
  for (let i in config) {
    let url = data[i];
    if (typeof url !== 'undefined' && url.length > 0 && !isValidURL(url)) {
      errorObj.postError(i, 'url');
    }
  }
};

const ruleExecutors = {
  required,
  number,
  url,
};

export const validate = (formname, stateVal) => {
  let formRules = config[formname];
  let data = stateVal || store.getState()[formname];
  let errorObj = new FormError();
  if (formRules) {
    const { _custom: customRules = [], ...stdRules } = formRules;
    for (let rule in stdRules) {
      if (ruleExecutors[rule]) {
        ruleExecutors[rule](data, formRules[rule], errorObj);
      }
    }
    if (customRules.length > 0) {
      customRules.forEach(rule => rule(data, errorObj));
    }
    let results = {
      data: { ...data },
    };
    if (errorObj.hasErred()) {
      results.errors = errorObj.getData();
    }
    return results;
  } else {
    return data;
  }
};
