import Campaign from './campaign/index';
import { connect } from 'preact-redux';
import campaignSelectors from '../store/objects/campaign/selectors';
import campaignActions from '../store/objects/campaign/actions';
import { isUndefined, at } from '@bit/kubric.utils.common.lodash';
import { redirect } from "@bit/kubric.utils.common.router";
import { getIndexUrl } from "../lib/links";
import services from '../services';
import DataFetcher, { getFetcherHandlers, getServiceHandler } from "../mixins/DataFetcher";
import useSelectors from "../store/objects/user/selectors";
import chatSelectors from "../store/objects/chat/selectors";

export const isExpectedCampaign = data => {
  const [expectedCampaign] = at(data, 'context.location.params.campaign');
  const stateCampaign = campaignSelectors.getCampaignId();
  return stateCampaign === expectedCampaign;
};

const StateConnector = connect(state => ({
  name: campaignSelectors.getCampaignName(state),
  feed: campaignSelectors.getCampaignFeedURL(state),
  pageNumber: campaignSelectors.getCurrentPage(state)
}), {});

const DataFetchedCampaign = StateConnector(
  DataFetcher({
    object: 'campaign',
    component: Campaign,
    fetcher: {
      service: getServiceHandler(services.campaign.get),
      fetcherData: {
        campaignId: "{{context.location.params.campaign}}",
      },
      shouldAvoidFetching(data) {
        return !useSelectors.isWorkspaceSet() || isExpectedCampaign(data);
      },
      ...getFetcherHandlers(campaignActions.campaignFetched)
    },
  }));

const StoreConnectedCampaign = StateConnector(Campaign);

export const routeWillLoad = ({ params = {} }, routes = []) => {
  const { campaign } = params;
  const campaignName = campaignSelectors.getCampaignName();
  const tagUsers = chatSelectors.getTagUsers();
  if (tagUsers.length === 0) {
    services.workspace.getCurrentWorkspaceUsers()
      .notifyStore()
      .send();
  }
  if (isUndefined(campaign) && campaignName.length === 0) {
    redirect(getIndexUrl());
  } else if (!isUndefined(campaign)) {
    return {
      component: DataFetchedCampaign
    };
  } else {
    return {
      component: StoreConnectedCampaign
    };
  }
};