import Express from 'express';
import { responseTransformer, serviceHelper } from "./utils";

const Router = Express.Router();

Router.get('/:storyboard/:version', (req, res, next) => {
  serviceHelper(res, {
    resource: 'storyboard',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.params
    },
    transformer: responseTransformer,
  });
});

export default Router;