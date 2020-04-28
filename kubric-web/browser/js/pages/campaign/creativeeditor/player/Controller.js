import Controller from './controller/index';
import { connect } from "preact-redux";
import bulkEditSelectors from "../../../../store/objects/campaign/bulkedit/selectors";
import bulkEditOperations from "../../../../store/objects/campaign/bulkedit/operations";
import creativesSelectors from "../../../../store/objects/campaign/creatives/selectors";

export default connect(state => {
  const totalCount = creativesSelectors.getSelectedRowsCount(state);
  const currentCreative = bulkEditSelectors.getCurrentCreative(state) + 1;
  return ({
    countString: `${currentCreative} / ${totalCount}`,
    creativeName: bulkEditSelectors.getCurrentCreativeName(state),
    nextEnabled: bulkEditSelectors.nextEnabled(state),
    previousEnabled: bulkEditSelectors.previousEnabled(state)
  })
}, {
  ...bulkEditOperations
})(Controller);