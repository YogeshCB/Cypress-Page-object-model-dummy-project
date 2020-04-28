import Table from './table/index';
import { connect } from "preact-redux";
import PropResolver from "../../../../mixins/PropResolver";
import creativesListPack from "../../../../store/objects/campaign/creatives/list";
import creativesSelectors from "../../../../store/objects/campaign/creatives/selectors";
import campaignSelectors from "../../../../store/objects/campaign/selectors";
import creativesOperations from "../../../../store/objects/campaign/creatives/operations";
import { creativeTabs } from "../../../../../../isomorphic/constants/creatives";
import userSelectors from "../../../../store/objects/user/selectors";
import { isKubricUser } from "../../../../lib/utils";

const ResolvedComponent = PropResolver(Table, {
  data: creativesListPack.resolvers.getListData,
  loadingRows: creativesListPack.resolvers.getLoadingRowsIndices
});

export default connect(state => {
  const activeTab = creativesSelectors.getActiveTab(state);
  return ({
    tabId: creativesSelectors.getActiveTab(state),
    isFilterTab: activeTab === creativeTabs.FILTERED,
    filters: creativesListPack.selectors.getFilters(state),
    rowStats: creativesListPack.selectors.getRowStats(state),
    selected: creativesListPack.selectors.getSelectedIds(state),
    loading: creativesListPack.selectors.isQueryFilterLoading(state),
    loadingNext: creativesListPack.selectors.isQueryFilterLoadingNext(state),
    currentTabData: creativesListPack.selectors.getCurrentFilterResults(state),
    campaignStatus: campaignSelectors.getCampaignStatus(state),
    isKubricUser: isKubricUser(userSelectors.getUserEmail(state))
  });
}, {
  ...creativesListPack.operations,
  ...creativesOperations
})(ResolvedComponent);