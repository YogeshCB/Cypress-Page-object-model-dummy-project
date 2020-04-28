import { connect } from "preact-redux";
import Filters from './filters/index';
import creativesListPack from '../../../../store/objects/campaign/creatives/list';
import creativesSelectors from '../../../../store/objects/campaign/creatives/selectors';
import creativesOperations from '../../../../store/objects/campaign/creatives/operations';

export default connect(state => {
  const { source = [], selected = [] } = creativesListPack.selectors.getFilters(state);
  return ({
    source,
    selected,
    stats: creativesSelectors.getStats(state),
    showFilters: creativesSelectors.getShowFilters(state),
  });
}, {
  ...creativesListPack.operations,
  ...creativesOperations
})(Filters);