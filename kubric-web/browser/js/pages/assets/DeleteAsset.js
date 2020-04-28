import { h } from 'preact';
import ConfirmationDialog from '../../components/commons/ConfirmationDialog';
import { connect } from 'preact-redux';
import assetActions from '../../store/objects/assets/actions';
import assetOperations from '../../store/objects/assets/operations/index';
import assetSelectors from '../../store/objects/assets/selectors/index';
import assetListPack from '../../store/objects/lists/assets/index';
import folderListPack from '../../store/objects/lists/assets/folders';
import store from '../../store';
import fontIcons from 'stylesheets/icons/fonticons';
import { PrimaryButton } from '../../components/commons/misc';
import styles from 'stylesheets/assets/deleteasset';

export default connect(state => {
  let selected = assetListPack.selectors.getSelectedIds();
  const folderAssets = folderListPack.selectors.getSelectedIds();
  selected = [...selected,...folderAssets];
  return {
    visible: assetSelectors.getDeleteModalStatus(),
    heading: `Are you sure you want to delete ${folderAssets.length>0?'the folder':selected.length > 1 ? `${selected.length} assets` : 'the selected asset'} ?`,
    confirmBtn : <PrimaryButton onClick={()=>store.dispatch(assetOperations.onDelete())} theme={styles}><span className={fontIcons.fonticonDelete}></span>&nbsp;Delete</PrimaryButton>,
    children: 'Please note, this action cannot be undone.',
  }
}, {
  onCancel: assetActions.hideDeleteModal
})(ConfirmationDialog)