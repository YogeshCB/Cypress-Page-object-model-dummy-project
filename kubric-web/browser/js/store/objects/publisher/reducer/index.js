import types from '../types';
import flagReducer from '@bit/kubric.redux.reducers.flag';
import { combineReducers } from 'redux';
import { getAppendReducers, getAssignReducers, getExtractReducers } from "@bit/kubric.redux.reducers.payload";
import getFormErrorsReducer from '../../commons/formerrors';
import adCampaignsPack from '../../lists/adcampaigns';
import channels from './channels';
import { getPublisherAccount, getAdAccount } from "../../servicetypes";

export default combineReducers({
  adcampaigns: adCampaignsPack.reducer,
  ...getExtractReducers({
    pages: {
      type: getPublisherAccount.COMPLETED,
      path: 'response.pages.data',
      defaultState: []
    },
    igAccounts: {
      type: getAdAccount.COMPLETED,
      path: 'response.instagramAccounts.data',
      defaultState: [],
      transform(payload = []) {
        return payload.map(({ username, ...rest }) => ({
          username,
          name: username,
          ...rest,
        }));
      },
    },
    applications: {
      type: getAdAccount.COMPLETED,
      path: 'response.applications.data',
      defaultState: []
    },
    adsPixels: {
      type: getAdAccount.COMPLETED,
      path: 'response.adsPixels.data',
      defaultState: []
    },
  }),
  formErrors: getFormErrorsReducer('publisher'),
  ...flagReducer('showPublisher', {
    on: types.SHOW_PUBLISHER,
    off: types.HIDE_PUBLISHER,
  }),
  ...getAppendReducers({
    data: {
      type: [types.PUBLISHER_FIELD_CHANGE, types.SHOW_PUBLISHER, types.PUBLISHER_CHANNEL_CHANGE],
      defaultState: {
        campaignType: 'new',
        campaignObjective: 'VIDEO_VIEWS',
        adText: '{{ad_text}}',
        link: '{{landing_page}}',
        adTitle: '{{ad_name}}',
        headline: '{{ad_headline}}',
        adSetName: '{{adset_name}}'
      },
    },
    selectionFields: [types.PUBLISHER_FIELD_SELECTED, types.PUBLISHER_FIELD_UNSELECTED],
  }),
  ...getAssignReducers({
    pageNumber: {
      type: types.SET_PAGE,
      defaultState: 0,
    },
  }),
  channels
});