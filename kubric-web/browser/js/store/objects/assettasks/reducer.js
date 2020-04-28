import { combineReducers } from 'redux';
import types from './types';
import selectors from './selectors';
import getUploadTypes from '../uploads_new/types';
import flagReducer from '@bit/kubric.redux.reducers.flag';

const uploadTypes = getUploadTypes('asset_upload');

const buildMap = (state, payload) => {
  let stateMap = state;
  if (payload.created_for) {
    if (stateMap[payload.created_for]) {
      if (payload.progress > 40) {
        stateMap = {
          ...state,
          [payload.created_for]: {
            ...stateMap[payload.created_for],
            ...payload
          }
        }
      }
    } else {
      stateMap = {
        ...state,
        [payload.created_for]: payload
      }
    }
  }
  /// For Archive Tasks - 'created_for' is not available
  else if (payload.type === 'ArchiveTask') {
    if (stateMap[payload.uid]) {
      stateMap = {
        ...state,
        [payload.uid]: {
          ...stateMap[payload.uid],
          ...payload
        }
      }
    } else {
      stateMap = {
        ...state,
        [payload.uid]: payload
      }
    }
  }
  return stateMap;
}
const updateTask = (state, key, payload, message) => {
  if (state[key]) {
    return {
      ...state,
      [key]: {
        ...state[key],
        message: message ? message : payload.fraction === '' ? 'Uploaded' : 'Uploading',
        progress: message === 'Upload Failed' ? 0 : parseInt(((payload.progressPercent) / 100) * 40) || 0,
        fraction: payload.fraction || '',
        hasErred: message === 'Upload Failed'
      }
    };
  } else {
    return {
      ...state,
      [key]: {
        message: message ? message : payload.fraction === '' ? 'Uploaded' : 'Uploading',
        progress: message === 'Upload Failed' ? 0 : parseInt(((payload.progressPercent) / 100) * 40) || 0,
        title: payload.name,
        key,
        fraction: payload.fraction || '',
        hasErred: message === 'Upload Failed'
      }
    }
  }
}

const assettasks = (state = {}, action) => {
  switch (action.type) {
    case uploadTypes.INITIATED:
      if (Array.isArray(action.payload.data)) {
        let stateMap = state;
        const inProgress = action.payload.data;
        inProgress.map(task => {
          stateMap = {
            ...stateMap,
            ...updateTask(state, task.key, task)
          }
        });
        return stateMap;
      } else {
        return updateTask(state, action.payload.key, action.payload.data);
      }
    case types.REPLACE_TASK_ROW:
      const old = selectors.getById(action.payload.old);
      delete state[action.payload.old];
      return Object.assign({}, {
        ...state,
        [action.payload.new]: old
      });
    case uploadTypes.PROGRESSED:
      const key = action.payload.key;
      return updateTask(state, key, action.payload);
    case uploadTypes.FAILED:
      if (state[action.payload.key]) {
        return updateTask(state, action.payload.key, action.payload.data, 'Upload Failed');
      } else {
        return state;
      }
    case types.SAVE_ASSET_TASK:
      const keys = Object.keys(action.payload);
      let recentAssetTasks = {};
      keys.map(key => {
        recentAssetTasks = buildMap(state, action.payload[key])
      });
      return recentAssetTasks;
    case types.SAVE_CHILD_DATA:
      return buildMap(state, action.payload);
    case types.PURGE_ASSET_TASK:
      return {};
    case types.DELETE_ASSET_TASK:
      delete state[action.payload.id];
      return Object.assign({}, state);
    default:
      return state
  }
};

export default combineReducers({
  data: assettasks
});