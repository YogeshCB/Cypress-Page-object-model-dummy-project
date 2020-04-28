import Express from 'express';
import Resolver from '../resolver';
import logger from '../lib/logger';

const Router = Express.Router();

export const resolveBindings = (parameters, segment, userid, token, workspace) => {
  const { attributes = [] } = segment;
  const resolvers = parameters.map(
    parameter => (new Resolver(parameter, {
      token,
      attributes,
      userid,
      workspace
    })).resolve());
  return Promise.all(resolvers)
    .then(results => {
      const hasErred = results.some(({ errors = {} } = {}) => Object.keys(errors).length > 0);
      return {
        hasErred,
        results
      };
    });
};

Router.post('/', async (req, res) => {
  try {
    const { parameters = [], segment = {} } = req.body;
    const { token, email, workspace_id } = req._sessionData;
    const results = await resolveBindings(parameters, segment, email, token, workspace_id);
    res.status(200).send(results);
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(ex);
  }
});

export default Router;