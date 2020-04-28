import Express from 'express';
import { serviceHelper } from "./utils";

const Router = Express.Router();

Router.post('/', (req, res) => {
  serviceHelper(res, {
    resource: 'suggest',
    service: 'getSuggestions',
    data: {
      ...req._sessionData,
      ...req.body,
    }
  });
});

export default Router;