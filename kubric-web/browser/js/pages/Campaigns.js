import Campaigns from './campaigns/index';
import { connect } from 'preact-redux';
import campaignsSelectors from "../store/objects/campaigns/selectors";
import campaignsActions from "../store/objects/campaigns/actions";
import DataFetcher, { getFetcherHandlers, getServiceHandler } from '../mixins/DataFetcher';
import services from '../services';
import campaignsListPack from "../store/objects/lists/campaigns";
import store from "../store";

export const routeUnloaded = () => campaignsListPack.operations.onPurgeList()(store.dispatch);

export default connect(state => ({
  count: campaignsSelectors.getCount(state),
  loading: campaignsSelectors.getLoading(state)
}), {})(DataFetcher({
  component: Campaigns,
  objects: {
    campaigns: {
      service: getServiceHandler(services.campaigns.get),
      ...getFetcherHandlers(campaignsActions.campaignsFetched),
    },
  },
}));
