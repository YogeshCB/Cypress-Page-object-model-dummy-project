import getTypes from './types';
import getSelectors from './selectors';
import getReducer from './reducer';
import { getOperations, getActions } from "@bit/kubric.redux.reducks.utils";

export default (id, { getState }) => {
  const types = getTypes(id);
  const actions = getActions(types);
  return {
    types,
    actions,
    operations: getOperations(actions),
    reducer: getReducer(types),
    selectors: getSelectors(getState)
  };
};
