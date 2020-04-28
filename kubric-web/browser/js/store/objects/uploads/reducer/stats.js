import { getWithout } from "@bit/kubric.redux.state.utils";;
import { compose } from "@bit/kubric.redux.reducers.utils";

const getUpdatedStats = (targetKey, status, newKey, state) => {
  const currentStats = state[targetKey] || {};
  return ({
    ...state,
    [targetKey]: {
      ...currentStats,
      [status]: [...(currentStats[status] || []), newKey]
    }
  });
};

const removeFromInitiated = (targetKey, keyToRemove, state) => {
  const currentStats = state[targetKey] || {};
  return ({
    ...state,
    [targetKey]: {
      ...currentStats,
      initiated: getWithout(currentStats.initiated, keyToRemove),
    }
  });
};

export default (state = {}, action, targetKey, types) => {
  const { extraData = {} } = action.payload;
  const { __key__: key } = extraData;
  const removeReducer = removeFromInitiated.bind(null, targetKey, key);
  switch (action.type) {
    case types.UPLOAD_INITIATED:
      return getUpdatedStats(targetKey, 'initiated', key, state);
    case types.UPLOAD_COMPLETED:
      return compose([
        getUpdatedStats.bind(null, targetKey, 'completed', key),
        removeReducer
      ], state);
    case types.UPLOAD_FAILED:
      return compose([
        getUpdatedStats.bind(null, targetKey, 'failed', key),
        removeReducer
      ], state);
    default:
      return state;
  }
};
