import { h } from 'preact';
import FilterPanel from './panel/index';
import FilterCompact from  './filtercompact';
import { connect } from 'preact-redux';
import assetListPack from '../../../store/objects/lists/assets/index';
import assetActions from '../../../store/objects/assets/actions';
import assetSelectors from '../../../store/objects/assets/selectors';
import assetOperations from '../../../store/objects/assets/operations';

export default ({ compact = false, ...props }) => {
  let Component = connect(state => ({
      filters: assetListPack.selectors.getFilters(),
      firstFilterSelected: assetSelectors.getFirstFilterSelected(),
      filterString: assetListPack.selectors.getFiltersAsQuery(),
      ...props
    }), {
    ...assetActions,
    ...assetOperations,
    ...assetListPack.operations,
    onFilterSelected: assetOperations.onFilterSelected
  })(compact ? FilterCompact : FilterPanel);
  
  return <Component />;
}
