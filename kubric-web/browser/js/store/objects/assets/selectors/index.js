import store from '../../../../store';
import { at } from "@bit/kubric.utils.common.lodash";
import navigationSelectors from './navigation';
import transformationSelectors from './transformations';
import uploadSelectors from './upload';
import shutterstockSelectors from './shutterstock';

const folders = state => assets(state).folderAssets;

const assets = state => (state || store.getState()).assets;

const getAsset = (id, state) => assets(state).data.byId[id];

const getFolderAsset = (id, state) => folders(state).byId[id];

const getData = state => assets(state).data;


// UI States

const getFullScreenStatus = state => assets(state).showFullscreen;

const getHoveredIndex = state => assets(state).hovered;

const getVariantDeleteModalStatus = state => assets(state).deleteVariantModal;

const getUploadMenuStatus = state => assets(state).uploadMenu;

const isAssetsVisible = state => assets(state).showAssets;

const getShowTasksModal = state => assets(state).tasks;

const getDeleteModalStatus = state => assets(state).deleteModal;

const getWarningModalStatus = state => assets(state).warningModal;

const getAssetsSettings = state => at(assets(state), `settings`)[0];

const tagFormStatus = state => assets(state).taggingForm;

const tagFormLoading = state => assets(state).bulkUpadteLoading;

const getFolderDetailStatus = state => assets(state).folderDetails;

const getSelectedFolderPath = state => assets(state).folderPath;

const getSelectedFolderPathStatus = state => assets(state).showPath;

const getAppliedFilters = state => assets(state).appliedFilters;

const getGridStatus = state => assets(state).grid;

const getErrorMessage = state =>  assets(state).errorMessage;

// Share Folders
const getFolderData = state => assets(state).folder;

const getUpdateFolderStatus = state => assets(state).folder.folderUpdateStatus;

const getFolders = state => assets(state).folders;

const getVariantNameDialog = state => assets(state).variantNameDialog;

export default {
    getSelectedFolderPath, 
    getFullScreenStatus,
    getErrorMessage,
    getVariantDeleteModalStatus,
    getSelectedFolderPathStatus,
    getVariantNameDialog,
    getGridStatus,
    getFolderDetailStatus,
    getAsset,
    getAppliedFilters,
    getFolderAsset,
    getData,
    getUpdateFolderStatus,
    tagFormStatus,
    tagFormLoading,
    getHoveredIndex,
    getUploadMenuStatus,
    isAssetsVisible,
    getShowTasksModal,
    getDeleteModalStatus,
    getWarningModalStatus,
    getAssetsSettings,
    getFolderData,
    getFolders,
    getState: assets,
    ...uploadSelectors,
    ...shutterstockSelectors,
    ...navigationSelectors,
    ...transformationSelectors
};