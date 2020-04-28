import services from '../services';
import Resolver from '@bit/kubric.utils.common.json-resolver';
import csv from 'fast-csv';
import logger from '../lib/logger';
import _ from 'lodash';
import moment from "moment-timezone";

export const responseTransformer = res => res.data || [];

export const getDate = dataStr => `${moment(moment(dataStr).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')).calendar()}`;

export const serviceHelper =
  async (res, { responsePromise, resource, service, data = {}, transformer = {}, response: responseTemplate } = {}) => {
    let respTransformer = transformer, errorTransformer;
    if (!_.isFunction(transformer)) {
      respTransformer = transformer.response;
      errorTransformer = transformer.error;
    }
    try {
      if (!responsePromise) {
        responsePromise = services[resource][service]()
          .send(data);
      }
      let response = await responsePromise;
      if (_.isFunction(respTransformer)) {
        response = respTransformer(response);
        if (_.isFunction(response.then)) {
          response = await response;
        }
      } else if (_.isObject(responseTemplate)) {
        const resolver = new Resolver();
        response = resolver.resolve(responseTemplate, response);
      }
      res.status(200).send(response);
    } catch (err) {
      logger.error(err);
      let results = {};
      if (_.isFunction(errorTransformer)) {
        results = errorTransformer(err);
      }
      res.status(results.status || 500).send(results.error || err);
    }
  };

export const parseCSV = (fileStream, { hasHeaders = false, ignoreEmptyFields = true, additionalData, transform }) =>
  new Promise(resolve => {
    let results = [];
    let headers = [];
    fileStream.pipe(csv())
      .on('data', data => {
        if (hasHeaders && headers.length === 0) {
          headers = data.map(column => column.toLowerCase().replace(/\s+/g, '_'));
        } else if (hasHeaders) {
          additionalData = additionalData || {};
          let rowData = data.reduce((obj, fieldVal, index) => {
            const currentHeader = headers[index];
            if (currentHeader.length === 0) {
              return obj;
            }
            fieldVal = fieldVal.replace(/\n/g, '');
            if (!ignoreEmptyFields || (typeof fieldVal !== 'undefined' && fieldVal.length > 0)) {
              if (Array.isArray(obj[currentHeader])) {
                obj[currentHeader].push(fieldVal);
              } else if (obj[currentHeader] && !Array.isArray(typeof obj[currentHeader])) {
                obj[currentHeader] = [obj[currentHeader], fieldVal];
              } else {
                obj[headers[index]] = fieldVal;
              }
            }
            return obj;
          }, { ...additionalData });
          rowData = transform && transform(rowData, headers);
          results.push(rowData);
        } else {
          additionalData = additionalData || [];
          results.push([...data, ...additionalData]);
        }
      })
      .on('end', () => resolve(results));
  });