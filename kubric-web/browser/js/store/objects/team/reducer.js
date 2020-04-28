import types from './types';
import { combineReducers } from 'redux';
import { teamsFetched, createTeam, updateTeam, deleteTeam } from "../servicetypes";
import campaignsListPack from '../lists/campaigns/index';
import assetListPack from '../lists/assets/index';
import folderListPack from '../lists/assets/folders';
import reducerFactory, { macros } from "@bit/kubric.redux.reducers.factory";

const getResponse = payload => payload.response || payload;

const teams = (state = [], action) => {
  switch (action.type) {
    case teamsFetched.COMPLETED:
    case types.TEAMS_FETCHED:
      return getResponse(action.payload).data;
    default:
      return state;
  }
};

const selected = (state = [], action) => {
  switch (action.type) {
    case types.SELECT_TEAM:
      return [...state, action.payload];
    case types.UNSELECT_TEAM:
      return state.filter(team => team !== action.payload);
    case types.PURGE_SELECTED_TEAMS:
      return [];
    case assetListPack.types.ROW_SELECTED:
      const asset = assetListPack.selectors.getById(action.payload.uid || action.payload.id);
      return asset && asset.shared_with ? asset.shared_with : [];
    case folderListPack.types.ROW_SELECTED:
      const folder = folderListPack.selectors.getById(action.payload.uid || action.payload.id);
      return folder && folder.shared_with ? folder.shared_with : [];
    case campaignsListPack.types.ROW_SELECTED:
      return campaignsListPack.selectors.getById(action.payload.uid).shared_with || [];
    default:
      return state
  }
};

export default combineReducers({
  teams,
  selected,
  ...reducerFactory({
    reducers: {
      loading: {
        macro: macros.SWITCH,
        on: [createTeam.INITIATED, updateTeam.INITIATED, deleteTeam.INITIATED, teamsFetched.INITIATED],
        off: [createTeam.COMPLETED, updateTeam.COMPLETED, deleteTeam.COMPLETED, teamsFetched.COMPLETED]
      }
    }
  })
});
