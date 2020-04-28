import Actions from './actions/index';
import { connect } from 'preact-redux';
import creativesSelectors from "../../../../../store/objects/campaign/creatives/selectors";
import ssOperations from "../../../../../store/objects/campaign/ssupload/operations";
import creativesOperations from "../../../../../store/objects/campaign/creatives/operations";
import creativesListPack from "../../../../../store/objects/campaign/creatives/list";

export default connect(state => ({
  stats: creativesSelectors.getStats(state),
  tabId: creativesSelectors.getActiveTab(state),
  selected: creativesListPack.selectors.getSelectedRows(state)
}), {
  ...creativesOperations,
  ...ssOperations
})(Actions);
