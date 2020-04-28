import { connect } from "preact-redux";
import DataFetcher, { getFetcherHandlers, getServiceHandler } from "../../mixins/DataFetcher";
import Creatives from "./creatives/index";
import services from "../../services";
import store from "../../store";
import campaignActions from "../../store/objects/campaign/actions";
import creativesListPack from "../../store/objects/campaign/creatives/list";
import creativesActions from "../../store/objects/campaign/creatives/actions";
import { utilActions } from "../../store/objects/commons/actions";
import { TABS_FILTER } from "../../store/objects/campaign/creatives/list/filters";
import { isExpectedCampaign } from "../Campaign";
import { creativeTabs } from "../../../../isomorphic/constants/creatives";

const shouldAvoidFetching = data => {
  return isExpectedCampaign(data) &&
    creativesListPack.selectors.hasSomeData();
};

const DataFetchedComponent = DataFetcher({
  component: Creatives,
  ...getFetcherHandlers(),
  objects: {
    creatives: {
      service: getServiceHandler(services.campaign.getAds),
      fetcherData: {
        campaignId: "{{context.location.params.campaign}}",
        tabs: "all"
      },
      shouldAvoidFetching,
      onFetched(res) {
        const creatives = res.video || res;
        store.dispatch(utilActions.batchedAction([
          creativesListPack.actions.purgeList(),
          creativesListPack.actions.filterSelected({
            id: TABS_FILTER,
            data: {
              value: "all"
            }
          }),
          creativesActions.tabChanged(creativeTabs.ALL),
          campaignActions.creativesFetched(creatives)
        ]));
        store.dispatch(campaignActions.creativesLoaded(creatives));
      },
    },
    stats: {
      service: getServiceHandler(services.campaign.getStats),
      shouldAvoidFetching,
      fetcherData: {
        campaignId: "{{context.location.params.campaign}}"
      },
      onFetched(res) {
        store.dispatch(campaignActions.statsFetched(res));
      },
    },
  },
});

export default connect(state => ({}), {})(DataFetchedComponent);