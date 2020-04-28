import { combineReducers } from 'redux';
import campaignListPack from "../lists/campaigns";
import types from './types';
import { fetchCampaigns, confirmCampaignShare } from "../servicetypes";
import reducerFactory, { actions } from "@bit/kubric.redux.reducers.factory";

export default combineReducers({
  data: campaignListPack.reducer,
  ...reducerFactory({
    reducers: {
      showShared: {
        defaultState: false,
        config: [{
          types: types.SHOW_TEAMS,
          action: actions.FLAG_ON
        }, {
          types: types.CLOSE_SHARED,
          action: actions.FLAG_OFF
        }]
      },
      loading: {
        defaultState: false,
        config: [{
          types: [fetchCampaigns.INITIATED, confirmCampaignShare.INITIATED],
          action: actions.FLAG_ON
        }, {
          types: fetchCampaigns.COMPLETED,
          action: actions.FLAG_OFF
        }]
      }
    }
  })
});
