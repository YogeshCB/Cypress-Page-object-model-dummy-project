import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

// GET TEAM
Router.get('/', (req, res, next) => {
    serviceHelper(res, {
      resource: 'roles',
      service: 'get',
      data: {
        ...req._sessionData,
      },
    });
  });


export default Router;