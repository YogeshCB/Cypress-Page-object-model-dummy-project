import homeCampaignsListPack from '../lists/homecampaigns';
import { combineReducers } from 'redux';
import flagReducer from '@bit/kubric.redux.reducers.flag';
import appTypes from '../app/types';
import types from './types';
import workspaceTypes from '../workspace/types';
import { at } from '@bit/kubric.utils.common.lodash';

const isEmpty = (state = false, action) => {
  switch (action.type) {
    case appTypes.RECENT_CAMPAIGNS_UPDATED:
      return at(action, 'payload', [])[0].length === 0;
    default:
      return state;
  }
};

export default combineReducers({
  isEmpty,
  ...flagReducer('campaignsLoading', {
    on: [appTypes.APP_LOADED, workspaceTypes.WORKSPACE_SELECTED, types.FETCHING_CAMPAIGN_DETAILS],
    off: [types.CAMPAIGN_DETAILS_FETCHED]
  }),
  campaigns: homeCampaignsListPack.reducer,
});