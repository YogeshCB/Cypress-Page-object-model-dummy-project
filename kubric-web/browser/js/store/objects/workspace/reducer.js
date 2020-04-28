import types from './types';
import { combineReducers } from 'redux';
import flagReducer from '@bit/kubric.redux.reducers.flag';
import {
  fetchWorkspaces,
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
  updateWorkspaceUsers,
  setWorkspace,
  fetchCurrentWorkspaceUsers
} from "../servicetypes";
import userTypes from '../user/types';
import { at } from "@bit/kubric.utils.common.lodash";
import roleTypes from './roles/types';
import { getAssignReducers, getExtractReducers } from "@bit/kubric.redux.reducers.payload";

const getResponse = payload => payload.response || payload;

const workspaces = (state = [], action) => {
  switch (action.type) {
    case fetchWorkspaces.COMPLETED:
    case types.WORKSPACES_FETCHED:
      return getResponse(action.payload).data;
    default:
      return state;
  }
};

const id = (state = '', action) => {
  switch (action.type) {
    case userTypes.USER_FETCHED:
      return at(action, 'payload.workspace_id', '')[0];
    case setWorkspace.COMPLETED:
      return getResponse(action.payload).workspace_id;
    default:
      return state
  }
};

const selectedWorkspace = (state = '', action) => {
  switch (action.type) {
    case fetchWorkspaces.COMPLETED:
    case types.HIDE_SWITCH_WORKSPACE:
      return '';
    default:
      return state
  }
};

const invitations = (state = [], action) => {
  switch (action.type) {
    case types.INVITATIONS_FETCHED:
      return action.payload.data;
    case setWorkspace.COMPLETED:
      return [];
    default:
      return state

  }
};

const workspace = (state = {}, action ) => {
  switch(action.type) {
    case types.WORKSPACE_FETCHED:
      return action.payload.data
    case types.PURGE_WORKSPACE_DETAILS:
      return {}
    default:
        return state
  }
}

export default combineReducers({
  workspaces,
  invitations,
  id,
  ...getExtractReducers({
    roles: {
      type: [roleTypes.ROLES_FETCHED],
      path: 'data',
      defaultState: []
    },
    workspace: {
      type: [types.WORKSPACE_FETCHED],
      path: 'data',
      defaultState: {},
      reducer: workspace
    }
  }),
  ...getAssignReducers({
    selectedWorkspace: {
      type: types.CHANGE_WORKSPACE,
      defaultState: '',
      reducer: selectedWorkspace
    },
    message: {
      type: types.SET_MESSAGE,
      defaultState: 'Please select a workspace to continue'
    }
  }),
  ...flagReducer('loading', {
    on: [fetchWorkspaces.INITIATED,
      createWorkspace.INITIATED,
      deleteWorkspace.INITIATED,
      updateWorkspace.INITIATED,
      updateWorkspaceUsers.INITIATED],
    off: [fetchWorkspaces.FAILED,
      createWorkspace.FAILED,
      deleteWorkspace.FAILED,
      updateWorkspace.FAILED,
      updateWorkspaceUsers.FAILED,
      fetchWorkspaces.COMPLETED,
      createWorkspace.COMPLETED,
      deleteWorkspace.COMPLETED,
      updateWorkspace.COMPLETED,
      updateWorkspaceUsers.COMPLETED]
  }),
});
