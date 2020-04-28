import Express from 'express';
import { serviceHelper } from "./utils";


const Router = Express.Router();

Router.get('/', (req, res, next) => {
  serviceHelper(res, {
    resource: `${req.entity}`,
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.query,
      ...req.params,
    },
  });
});

export default Router;