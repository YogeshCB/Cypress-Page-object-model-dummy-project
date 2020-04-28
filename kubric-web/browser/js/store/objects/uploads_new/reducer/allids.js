import { replaceArrayEntry } from "@bit/kubric.redux.state.utils";
import { getPayload } from "./utils";

export default ({ types }, state = [], action) => {
  switch (action.type) {
    case types.REPLACE_ENTRY:
      return replaceArrayEntry(state, action);
    case types.INITIATED:
      const payload = getPayload(action);
      const keys = payload.map(({ key }) => key);
      return [...keys, ...state];
    case types.PURGE:
      return [];
    default:
      return state;
  }
};
