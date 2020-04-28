import getTypes from './types';
import getSelectors from './selectors';
import getReducer from './reducer';
import getActions from './actions';
import getOperations from './operations';

export default (id, { getState, reducer: extReducer }) => {
  const types = getTypes(id);
  const actions = getActions(types);
  const operations = getOperations(actions);
  const selectors = getSelectors(getState);
  const reducer = getReducer(types, selectors, extReducer);
  return {
    types,
    actions,
    operations,
    reducer,
    selectors
  };
};
