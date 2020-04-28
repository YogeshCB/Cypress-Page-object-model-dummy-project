import types from './types';
import { getActions } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getActions(types),
  tabLoaded(tabId) {
    return {
      type: types.TAB_LOADED,
      payload: {
        [tabId]: false
      }
    };
  },
  tabLoading(tabId) {
    return {
      type: types.TAB_LOADING,
      payload: {
        [tabId]: true
      }
    };
  }
};