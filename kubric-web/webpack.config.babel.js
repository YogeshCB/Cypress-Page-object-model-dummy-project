import merge from 'webpack-merge';
import baseConfig from './webpack/base.config';

const NODE_ENV = process.env.NODE_ENV || 'development';
const PAGE = process.env.PAGE || 'app';

export const getConfigFor = (page, env) => {
  const pageConfig = require(`./webpack/${page}.config.js`);
  const envConfig = require(`./webpack/${env}.config.js`);
  let pageEnvConfig = {
    default: {}
  };
  try {
    pageEnvConfig = require(`./webpack/${page}.${env}.config.js`);
  } catch (ex) {
  }
  const modifier = pageConfig.configModifier;
  let config = merge(
    baseConfig,
    pageConfig.default,
    envConfig.default,
    pageEnvConfig.default
  );
  if (typeof modifier === 'function') {
    config = modifier(config);
  }
  return config;
};

export default getConfigFor(PAGE, NODE_ENV === 'production' ? 'production' : 'default');
