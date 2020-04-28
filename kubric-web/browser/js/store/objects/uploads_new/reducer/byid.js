import { FAILED, INITIATED, SUCCESS } from "../constants";
import { replaceObjectEntry } from "@bit/kubric.redux.state.utils";
import { getPayload } from "./utils";

const updateState = (state, key, patch = {}) => ({
  ...state,
  [key]: {
    ...state[key],
    ...patch,
  }
});

export default ({ types }, state = {}, action) => {
  const { key, response = {}, progressPercent, file = {} } = action.payload || {};
  switch (action.type) {
    case types.REPLACE_ENTRY:
      return replaceObjectEntry(state, action);
    case types.INITIATED: {
      let payload = getPayload(action);
      return payload.reduce((acc, { data, key }) =>
        updateState(acc, key, {
          data,
          progress: 0,
          uploading: true,
          status: INITIATED
        }), { ...state });
    }
    case types.FAILED:
      return updateState(state, key, {
        progress: 0,
        hasErred: true,
        status: FAILED,
        uploading: false,
        file
      });
    case types.COMPLETED:
      return updateState(state, key, {
        progress: 100,
        uploading: false,
        status: SUCCESS,
        url: response ? response.url : undefined
      });
    case types.PROGRESSED:
      return updateState(state, key, {
        progress: parseInt(progressPercent)
      });
    case types.PURGE:
      return {};
    default:
      return state;
  }
};
