import getTypes from './types';
import getReducer from './reducer';
import getActions from './actions';
import getResolvers from './resolvers';
import getOperations from './operations';
import { getSelectors } from './selectors';
import getConnector from './connect';

export { resolverIds as constants } from './constants';

export default (id, conf) => {
  const types = getTypes(id);
  const actions = getActions(types);
  const selectors = getSelectors(conf);
  const operations = getOperations(actions);
  const reducer = getReducer({
    ...conf,
    types
  });
  const resolvers = getResolvers(selectors);
  const connect = getConnector(selectors, resolvers);
  return {
    types,
    actions,
    selectors,
    reducer,
    operations,
    resolvers,
    connect
  };
};