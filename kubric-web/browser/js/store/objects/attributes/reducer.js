import types from './types';
import selectors from './selectors';
import { extractField, indexBy } from "@bit/kubric.redux.state.utils";
import { combineReducers } from 'redux';
import { ID_FIELD } from "./constants";
import { fetchAttributes } from "../servicetypes";

const byId = (state = {}, action) => {
  switch (action.type) {
    case types.ATTRIBUTES_FETCHED:
    case fetchAttributes.COMPLETED:
      return {
        ...state,
        ...indexBy(action.payload, {
          field: ID_FIELD,
        }),
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case types.ATTRIBUTES_FETCHED:
    case fetchAttributes.COMPLETED:
      return [
        ...state,
        ...extractField(action.payload, {
          field: ID_FIELD,
          dedupe: selectors.getById
        }),
      ];
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds,
});
