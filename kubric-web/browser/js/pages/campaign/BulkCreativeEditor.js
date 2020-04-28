import CreativeEditor from './creativeeditor/index';
import { connect } from "preact-redux";
import DataFetcher, { getFetcherHandlers, getServiceHandler } from "../../mixins/DataFetcher";
import services from "../../services";
import creativesListPack from "../../store/objects/campaign/creatives/list";
import { redirect } from "@bit/kubric.utils.common.router";
import { getIndexUrl } from "../../lib/links";
import bulkEditSelectors from "../../store/objects/campaign/bulkedit/selectors";
import bulkEditOperations from "../../store/objects/campaign/bulkedit/operations";
import bulkEditActions from "../../store/objects/campaign/bulkedit/actions";
import userSelectors from "../../store/objects/user/selectors";
import campaignSelectors from "../../store/objects/campaign/selectors";
import creativesSelectors from "../../store/objects/campaign/creatives/selectors";

const DataFetchedComponent = DataFetcher({
  component: CreativeEditor,
  objects: {
    storyboard: {
      ...getFetcherHandlers(bulkEditActions.storyboardsFetched),
      service: getServiceHandler(services.storyboards.get),
      shouldAvoidFetching({ context }) {
        const selectedCreatives = creativesListPack.selectors.getSelectedRows();
        return !userSelectors.isWorkspaceSet() || selectedCreatives.length === 0;
      },
      fetcherData() {
        const addedSet = new Set();
        const ids = creativesListPack.selectors.getSelectedRows()
          .reduce((acc, { storyboard_id: id, storyboard_version: version }) => {
            if (!addedSet.has(id)) {
              addedSet.add(id);
              acc.push(`${id}:${version}`);
            }
            return acc;
          }, []);
        return {
          ids
        };
      }
    }
  }
});

const ConnectedComponent = connect(state => {
  const creativeCount = creativesSelectors.getSelectedRowsCount(state);
  return ({
    shotCount: bulkEditSelectors.getShots(state).length,
    mode: "bulk",
    name: `${campaignSelectors.getCampaignName(state)} - Editing ${creativeCount} ads`
  })
}, {
  ...bulkEditOperations,
})(DataFetchedComponent);

export const routeWillLoad = () => {
  const selectedCreatives = creativesListPack.selectors.getSelectedRows();
  if (selectedCreatives.length === 0) {
    redirect(getIndexUrl());
  } else {
    return ConnectedComponent;
  }
};
