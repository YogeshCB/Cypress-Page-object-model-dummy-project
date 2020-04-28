import {
  teamsFetched,
  shareFolders,
  newFolder,
  moveToFolder,
  getFolders,
  saveAsset,
} from "../../servicetypes";

export default (types, state = { open: false, loading: false, folderUpdateStatus: false }, action) => {
  switch (action.type) {
    case types.CHANGE_FOLDER_DETAILS:
      return {
        ...state,
        ...action.payload
      };
    case types.OPEN_RENAME:
      return {
        ...state,
        open: true,
        id: action.payload.id
      };
    case types.FOLDER_UPDATE:
      return {
        ...state,
        folderUpdateStatus: true
      };
    case saveAsset.INITIATED:
    case shareFolders.INITIATED:
    case newFolder.INITIATED:
    case getFolders.INITIATED:
    case teamsFetched.INITIATED:
    case moveToFolder.INITIATED:
      return {
        ...state,
        loading: true
      };
    case saveAsset.COMPLETED:
    case shareFolders.COMPLETED:
    case newFolder.COMPLETED:
    case getFolders.COMPLETED:
    case teamsFetched.COMPLETED:
    case moveToFolder.COMPLETED:
      return {
        ...state,
        open: false,
        loading: false
      };
    case types.CLOSE_RENAME:
      return {
        ...state,
        open: false,
        id: undefined,
        folderUpdateStatus: false,
        name: '',
        description: ''
      };
    default:
      return state
  }
};