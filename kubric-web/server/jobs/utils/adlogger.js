import moment from 'moment';
import { getAdRef } from "./index";

export default class AdLogger {
  constructor(campaign, ad) {
    this.adRef = getAdRef(campaign, ad);
    this.logIndex = 0;
  }

  static getErrorData(ex) {
    return {
      message: ex.message || '',
      code: ex.code || '',
      stack: ex.stack || ''
    };
  }

  log(message, data = {}) {
    this.adRef.add({
      message,
      data: {
        ...data
      },
      time: moment().format("DD-MM-YYYY hh:mm:ss"),
      index: this.logIndex
    });
    this.logIndex++;
  }

  error(message, ex) {
    const data = {
      error: AdLogger.getErrorData(ex)
    };
    this.log(message, data);
  }
}