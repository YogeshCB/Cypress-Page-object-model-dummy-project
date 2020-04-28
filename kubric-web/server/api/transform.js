import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

Router.get('/:assetId/:transformations', (req, res, next) => {
    serviceHelper(res, {
      resource: 'transform',
      service: 'transform',
      data: {
        ...req._sessionData,
        ...req.params,
      },
      error(err) {
        if (err.status === 404 || err.status === 500) {
          return {
            status: 200,
            error: JSON.parse(err.response.text)
          };
        }
      }
    });
});

Router.get('/:assetId/:filter', (req, res, next) => {
  serviceHelper(res, {
    resource: 'transform',
    service: 'filter',
    data: {
      ...req._sessionData,
      ...req.params,
    },
  });
});
  


export default Router;