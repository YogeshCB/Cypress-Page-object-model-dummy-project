const config = jest.genMockFromModule('config');
import _ from 'lodash';

const commonConfig = {
  api: {
    current: 'v1',
    versions: {
      'v1': '/api/v1',
    },
    endpoints: {
      channels: '/channels',
      channel: '/channel',
      episodes: '/episodes',
      episode: '/episode',
      image: '/image',
      audio: '/audio',
      rss: '/rss/parse',
      authenticate: '/authenticate',
      signup: '/signup',
      topics: '/topics',
      bucket: '/bucket',
    },
  },
};

let envtConfig = {
  'development': {
    api: {
      host: 'raydio-test.appspot.com',
    },
  },
  'release': {
    api: {
      host: 'raydio-test.appspot.com',
    },
  },
  'production': {
    api: {
      host: 'developer.raydio.in',
    },
  },
};

const getConf = envt => _.merge({}, commonConfig, envtConfig[envt]);

let conf = {};

export const __setEnvironment = envt => {
  conf = getConf(envt);
};

export const get = path => _.at(conf, [path])[0];
