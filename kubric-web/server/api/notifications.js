import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

Router.get('/subscriptions', (req, res) => {
  serviceHelper(res, {
    resource: 'notifications',
    service: 'getSubscriptions',
    data: {
      ...req._sessionData,
    }
  });
});

Router.get('/', (req, res) => {
  serviceHelper(res, {
    resource: 'notifications',
    service: 'get',
    data: {
      ...req._sessionData,
    }
  });
});


Router.get('/config', (req, res) => {
  serviceHelper(res, {
    resource: 'notifications',
    service: 'getConfig',
    data: {
      ...req._sessionData,
    }
  });
});


Router.post('/trigger', (req, res) => {
  serviceHelper(res, {
    resource: 'notifications',
    service: 'triggerSubscription',
    data: {
      ...req._sessionData,
      ...req.body
    }
  });
});



export default Router;