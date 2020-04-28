import Express from 'express';
import { serviceHelper } from "./utils";
import _ from 'lodash';

const Router = Express.Router();

Router.get('/:ad', (req, res, next) => {
  serviceHelper(res, {
    resource: 'insights',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.params,
    },
    transformer: resp => _.get(resp, 'response.data', [])
  });
});

Router.get('/', (req, res, next) => {
  serviceHelper(res, {
    resource: 'insights',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.query,
      ad: 'batch'
    },
    transformer: (resp = []) => resp.map((adResponse = []) => _.get(adResponse, '0.response.data.0', {}))
  });
});

export default Router;