const apiList = [
  'user',
  'assets',
  'storyboards',
  'storyboard',
  'campaigns',
  'template',
  'templates',
  'effects',
  'team',
  'workspace',
  'notifications',
  'resolver',
  'campaign',
  'insights',
  'transform',
  'roles',
  'chat',
  'sourcing',
  'message',
  'suggest'
];

export const injectAPI = expressApp => {
  for (let i = 0; i < apiList.length; i++) {
    let resource = apiList[i];
    let middlewares = [];
    let path;
    if (typeof resource !== 'string') {
      middlewares = resource.middlewares || [];
      resource = resource.name;
      path = resource.path;
    }
    let router = require(`./${resource}`);
    if (typeof router !== 'function') {
      router = router.default;
    }
    expressApp.use(`/api/${typeof path === 'undefined' ? resource : path}`, middlewares, router);
  }
};
