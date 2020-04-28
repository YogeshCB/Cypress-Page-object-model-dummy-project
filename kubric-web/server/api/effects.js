import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

Router.post('/resolve', (req, res) => {
  serviceHelper(res, {
    resource: 'effects',
    service: 'resolve',
    data: {
      ...req._sessionData,
      ...req.body,
    }
  });
});

Router.get('/task/:taskId', (req, res) => {
  serviceHelper(res, {
    resource: 'effects',
    service: 'getTaskStatus',
    data: {
      ...req._sessionData,
      ...req.params,
    }
  });
});

export default Router;