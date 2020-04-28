import { connect } from 'preact-redux';
import assetSelectors from '../../../store/objects/assets/selectors/index';
import assetActions from '../../../store/objects/assets/actions';
import assetOperations from '../../../store/objects/assets/operations';
import assetListPack from '../../../store/objects/lists/assets/index';
import Transform from './transformation/index';

export default connect(state => ({
  selected: assetListPack.selectors.getSelectedIds(),
  transform: assetSelectors.getTransformData(),
  urls: assetSelectors.getTransformUrls(),
  selectedForm: assetSelectors.getTransformFormState(),
  loading: assetSelectors.getTransformLoading(),
  thumbnails: assetSelectors.getImageFilters(),
  grid: assetSelectors.getGridStatus()
}), {
  ...assetActions,
  ...assetOperations,
})(Transform);