import config from 'config';

const templateRoot = config.get('paths.templates');

const templates = {
  'login': require(`${templateRoot}/login.marko.js`),
  'shell': require(`${templateRoot}/index.marko.js`),
};

export const renderView = (res, { name, data = {} }) => {
  res.setHeader('content-type', 'text/html; charset=utf-8');
  templates[name].render({
    ...res.locals,
    ...data,
  }, res);
};