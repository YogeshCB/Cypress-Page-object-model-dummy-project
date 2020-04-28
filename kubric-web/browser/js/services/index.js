import serviceConfig from './config';
import serviceGenerator from '@bit/kubric.utils.common.services';
import { SERVICETYPE_PREFIX } from "../store/constants";
import { at } from "@bit/kubric.utils.common.lodash";

const services = serviceGenerator(serviceConfig, {
  getStore() {
    const { default: store } = require('../store');
    return store;
  },
  actionPrefix: SERVICETYPE_PREFIX
});

export default services;

export const getService = name => at(services, name)[0];
