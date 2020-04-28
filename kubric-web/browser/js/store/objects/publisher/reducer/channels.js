import campaignTypes from "../../campaign/types";
import campaignsTypes from "../../campaigns/types";
import types from "../types";
import { campaignFetched } from "../../servicetypes";

export default (state = ['facebook.ads'], action) => {
  switch (action.type) {
    case types.PUBLISHER_CHANNEL_ADDED:
      return [
        ...state,
        action.payload,
      ];
    case types.PUBLISHER_CHANNEL_REMOVED:
      return state.filter(val => val !== action.payload);
    case campaignTypes.CAMPAIGN_FETCHED:
    case campaignFetched.COMPLETED:
    case campaignsTypes.CAMPAIGN_SELECTED: {
      const { channel = 'facebook.ads' } = action.payload;
      return channel.split(',');
    }
    default:
      return state;
  }
};
