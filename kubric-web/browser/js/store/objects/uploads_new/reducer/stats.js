import { getWithout, replaceArrayEntry } from "@bit/kubric.redux.state.utils";
import { compose } from "@bit/kubric.redux.reducers.utils";
import { INPROGRESS, FAILED, INITIATED, SUCCESS } from "../constants";
import { getPayload } from "./utils";

const getUpdatedStats = (status, newKey, state = {}) => {
  const currentState = state[status] || [];
  return ({
    ...state,
    [status]: currentState.indexOf(newKey) >= 0 ? currentState : [...currentState, newKey]
  });
};

const removeFromStatus = (status, keyToRemove, state) => ({
  ...state,
  [status]: getWithout((state[status] || []), keyToRemove),
});

const DEFAULT_STATE = {
  [INITIATED]: [],
  [INPROGRESS]: [],
  [FAILED]: [],
  [SUCCESS]: [],
};

export default ({ types }, state = { ...DEFAULT_STATE }, action) => {
  const { key } = action.payload || {};
  const removeFromInitiated = removeFromStatus.bind(null, INITIATED, key);
  const removeFromProgress = removeFromStatus.bind(null, INPROGRESS, key);
  switch (action.type) {
    case types.REPLACE_ENTRY:
      return {
        [INITIATED]: replaceArrayEntry(state[INITIATED], action),
        [INPROGRESS]: replaceArrayEntry(state[INPROGRESS], action),
        [FAILED]: replaceArrayEntry(state[FAILED], action),
        [SUCCESS]: replaceArrayEntry(state[SUCCESS], action),
      };
    case types.INITIATED: {
      const payload = getPayload(action);
      return payload.reduce((acc, { key }) =>
        getUpdatedStats(INITIATED, key, acc), { ...state });
    }
    case types.COMPLETED:
      return compose([
        getUpdatedStats.bind(null, SUCCESS, key),
        removeFromProgress,
        removeFromInitiated
      ], state);
    case types.FAILED:
      return compose([
        getUpdatedStats.bind(null, FAILED, key),
        removeFromProgress,
        removeFromInitiated
      ], state);
    case types.PROGRESSED:
      return compose([
        getUpdatedStats.bind(null, INPROGRESS, key),
        removeFromInitiated
      ], state);
    case types.PURGE:
      return { ...DEFAULT_STATE };
    default:
      return state;
  }
};
