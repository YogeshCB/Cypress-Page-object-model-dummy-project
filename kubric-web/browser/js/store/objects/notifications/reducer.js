import types from './types';
import { combineReducers } from 'redux';

const byId = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION:
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
        }
      };
    case types.DELETE_NOTIFICATION:
      return {
        ...state,
        [action.payload.id]: undefined,
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION:
      return [
        ...state,
        action.payload.id,
      ];
    case types.DELETE_NOTIFICATION:
      return state.filter(id => id !== action.payload.id);
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds,
});
