import { combineReducers } from 'redux';
import assetTypes from "../types";
import flagReducer from '@bit/kubric.redux.reducers.flag';
import assetListPack from "../../lists/assets/index";
import {
  getFolders,
  bulkUpdate,
  zipFolder,
  getAssets
} from "../../servicetypes";
import { getAssignReducers } from "@bit/kubric.redux.reducers.payload";
import folderListPack from '../../lists/assets/folders';
import modal from './uploadmodal';
import subscription from './shutterstock';
import folder from './folder';
import path from './navigation';
import transformations from './transformations';
import fileUploadPack from '../fileuploads';

const settings = (types, state = {}, action) => {
  switch (action.type) {
    case types.SHOW_ASSETS:
      return {
        ...action.payload,
      };
    case types.HIDE_ASSETS:
      return {
        ...state,
        initData: undefined,
      };
    default:
      return state;
  }
};

const folders = (types, state = [], action) => {
  switch (action.type) {
    case getFolders.COMPLETED:
      const selectedFolder = folderListPack.selectors.getSelectedIds()[0];
      return action.payload.response.hits.filter(folder=> folder.id !== selectedFolder);
    case types.PURGE_FOLDERS:
      return [];
    default:
      return state;
  }
};

const hovered = (types, state = '', action) => {
  switch (action.type) {
    case types.MOUSE_ENTER:
      return action.payload.id;
    case types.MOUSE_LEAVE:
      return '';
    default:
      return state;
  }
};

const errorMessage = (state = '', action) => {
  switch (action.type) {
    case getAssets.FAILED:
      return action.payload.err.error
    default:
      return ''
  }
}

export default (state = {}, action) => {
  return combineReducers({
    settings: settings.bind(null, assetTypes),
    ...flagReducer('showAssets', {
      on: assetTypes.SHOW_ASSETS,
      off: assetTypes.HIDE_ASSETS,
    }),
    ...flagReducer('showFilters', {
      toggle: assetTypes.TOGGLE_FILTERS
    }),
    ...flagReducer('uploadModal', {
      toggle: assetTypes.UPLOAD_MODAL
    }),
    ...flagReducer('deleteModal', {
      on: assetTypes.SHOW_DELETE_MODAL,
      off: assetTypes.HIDE_DELETE_MODAL,
    }),
    ...flagReducer('taggingForm', {
      toggle: assetTypes.TAG_ASSETS
    }),
    ...flagReducer('grid', {
      toggle: assetTypes.TAG_ASSETS
    }),
    ...flagReducer('showPath', {
      on: assetTypes.SHOW_PATH,
      off: [assetTypes.HIDE_PATH, assetListPack.types.FILTER_CHANGED, assetListPack.types.ROW_UNSELECTED]
    }),
    ...getAssignReducers({
      folderPath: {
        type: assetTypes.SHOW_PATH,
        defaultState: {
          folderPath: '', 
          folderNames: []
        }
      }
    }),
    errorMessage,
    ...flagReducer('tasks', {
      toggle: assetTypes.SHOW_TASKS,
      on: zipFolder.INITIATED
    },{
      defaultValue: true
    }),
    ...flagReducer('grid', {
      toggle: assetTypes.ENABLE_GRID
    }),
    ...flagReducer('warningModal', {
      on: assetTypes.SHOW_WARNING_MODAL,
      off: assetTypes.HIDE_WARNING_MODAL,
    }),
    ...flagReducer('bulkUpadteLoading', {
      on: bulkUpdate.INITIATED,
      off: [bulkUpdate.COMPLETED, bulkUpdate.FAILED]
    }),
    ...flagReducer('uploadMenu', {
      on: assetTypes.SHOW_UPLOAD_MENU,
      off: assetTypes.HIDE_UPLOAD_MENU
    }),
    ...flagReducer('variantUpload', {
      toggle: assetTypes.IS_VARIANT
    }),
    ...flagReducer('folderDetails', {
      on: assetTypes.SHOW_FOLDER_DETAILS,
      off: assetTypes.HIDE_FOLDER_DETAILS
    }),
    ...flagReducer('deleteVariantModal',{
      toggle: assetTypes.DELETE_VARIANT_DIALOG
    }),
    ...flagReducer('showFullscreen',{
      toggle: assetTypes.FULL_SCREEN_MODE
    }),
    ...flagReducer('variantNameDialog', {
      toggle: assetTypes.VARIANT_DIALOG
    }),
    data: assetListPack.reducer,
    modal: modal.bind(null, assetTypes),
    subscription: subscription.bind(null, assetTypes),
    hovered: hovered.bind(null, assetTypes),
    path: path.bind(null, assetTypes),
    folder: folder.bind(null, assetTypes),
    folders: folders.bind(null, assetTypes),
    ...getAssignReducers({
      imageFilters: {
        type: assetTypes.SAVE_FILTERS,
        defaultState: []
      }
    }),
    fileuploads: fileUploadPack.reducer,
    transformations: transformations.bind(null, assetTypes),
    folderAssets: folderListPack.reducer
  })(state, action);
}