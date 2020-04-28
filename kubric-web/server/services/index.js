import ServicesManager from '@bit/kubric.utils.services.manager';
import config from 'config';
import firebase from '../lib/firebase';

const servicesRef = config.get('firebase.refs.config.server.services');
const apiConfig = config.get('api');

export const serviceManager = new ServicesManager(firebase.database().ref(servicesRef), {
  init: {
    key: "__kubric_config__",
    data: {
      host: apiConfig.host,
      apiHost: apiConfig.apiHost,
      root: config.get('root'),
      cookie: config.get('cookie.name'),
      env: process.env.NODE_ENV
    }
  }
});

export default serviceManager.services;
