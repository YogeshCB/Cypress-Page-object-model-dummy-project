import Picker from './picker/index';
import pickerActions from '../store/objects/picker/actions';
import { connect } from 'preact-redux';
import StoreResolver from '../mixins/PropResolver';
import assetSelectors from '../store/objects/assets/selectors';
import pickerOperations from '../store/objects/picker/operations';
import pickerSelectors from '../store/objects/picker/selectors';
import assetListPack from '../store/objects/lists/assets/index';

const StoreResolvedComponent = StoreResolver(Picker, {
  data: assetListPack.resolvers.getListData,
});

export default connect(state => {
  return ({
    query: assetListPack.selectors.getCurrentQuery(),
    filters: assetListPack.selectors.getFilters(),
    loading: pickerSelectors.isLoading(),
    completed: assetListPack.selectors.isQueryFilterCompleted(),
    uploadModalStatus: assetSelectors.getUploadModalStatus(),
    filterString: assetListPack.selectors.getFiltersAsQuery(),
    uploadMenu: assetSelectors.getUploadMenuStatus(),
    myAssets: assetListPack.selectors.getState(),
    showFilters: pickerSelectors.getFilterStatus(),
    network: pickerSelectors.getSelectedNetwork(),
    showTasksModal: assetSelectors.getShowTasksModal(),
    selectedAssetIds: assetListPack.selectors.getSelectedIds(),
  })
}, {
  ...pickerActions,
  ...pickerOperations,
  ...assetListPack.operations
})(StoreResolvedComponent);
