import { createCampaign } from "../../servicetypes";
import types from "../types";

export const campaignConfig = [{
  types: createCampaign.COMPLETED,
  action: {
    from: "response"
  }
}, {
  types: types.CAMPAIGN_FETCHED,
}];
