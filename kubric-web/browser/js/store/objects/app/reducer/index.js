import { combineReducers } from "redux";
import navSelected from './navselected';
import navOptions from './navoptions';
import types from '../types';
import reducerFactory, { actions } from "@bit/kubric.redux.reducers.factory";

export default combineReducers({
  ...reducerFactory({
    reducers: {
      recentCampaigns: {
        defaultState: [],
        types: types.RECENT_CAMPAIGNS_UPDATED,
      }
    }
  }),
  navSelected,
  navOptions
});