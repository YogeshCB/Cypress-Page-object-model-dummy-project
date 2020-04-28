import { getOperations } from "@bit/kubric.redux.reducks.utils";
import actions from './actions';
import { getCampaignUrl } from "../../../lib/links";
import { redirect } from "@bit/kubric.utils.common.router";
import selectors from "../app/selectors";
import services from "../../../services";
import { campaignFetched } from "./services";

const onCampaignSelected = campaignId => redirect(getCampaignUrl(campaignId));

const onFetchRecentCampaigns = () => dispatch => {
  dispatch(actions.fetchingCampaignDetails());
  const recentCampaigns = selectors.getRecentCampaigns();
  const promises = recentCampaigns.map(({ uid }) =>
    services.campaign.get({
        actions: campaignFetched.actions
      })
      .notifyStore()
      .send({
        campaignId: uid,
        registerView: false
      }));
  return Promise.all(promises)
    .then(res => dispatch(actions.campaignDetailsFetched(res)))
};

export default {
  ...getOperations(actions),
  onCampaignSelected,
  onFetchRecentCampaigns
};