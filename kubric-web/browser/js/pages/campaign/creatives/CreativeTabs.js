import Tabs from './creativetabs/index';
import { connect } from "preact-redux";
import creativesSelectors from "../../../store/objects/campaign/creatives/selectors";
import creativesOperations from "../../../store/objects/campaign/creatives/operations";
import creativesListPack from "../../../store/objects/campaign/creatives/list";
import PropResolver from "../../../mixins/PropResolver";
import ssOperations from "../../../store/objects/campaign/ssupload/operations";

const ResolvedComponent = PropResolver(Tabs, {
  data: creativesListPack.resolvers.getListData,
});

export default connect(state => ({
  stats: creativesSelectors.getStats(state),
  tabCounts: creativesSelectors.getTabCounts(state),
  activeTab: creativesSelectors.getActiveTab(state),
  loadingTabs: creativesSelectors.getLoadingTabs(state),
  selected: creativesListPack.selectors.getSelectedIds(state)
}), {
  ...creativesOperations,
  ...ssOperations
})(ResolvedComponent);