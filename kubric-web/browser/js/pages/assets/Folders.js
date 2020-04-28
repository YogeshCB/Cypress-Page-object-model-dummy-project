import { h } from 'preact';
import Folders from './folders/index';
import { connect } from 'preact-redux';
import assetActions from '../../store/objects/assets/actions';
import assetOperations from '../../store/objects/assets/operations';
import folderListPack from '../../store/objects/lists/assets/folders';
import assetListPack from '../../store/objects/lists/assets/index';
import StoreResolver from '../../mixins/PropResolver';
import assetSelectors from '../../store/objects/assets/selectors/index';

const StoreResolvedComponent = StoreResolver(Folders, {
  data: folderListPack.resolvers.getListData,
  assets: assetListPack.resolvers.getListData,
});

export default connect(state => ({
  showFilters: assetSelectors.getFilterStatus(),
  taggingForm: assetSelectors.tagFormStatus(),
  assetSelected: assetListPack.selectors.getSelectedIds(),
  assets: assetListPack.selectors.getState(),
  ...state.assets.folderAssets
}), {
  ...assetActions,
  ...assetOperations,
  ...folderListPack.operations,
})(StoreResolvedComponent);



