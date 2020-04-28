import assetListPack from '../../lists/assets/index';

export default (types, state = { 
  navPath: '/root', 
  path: '/root', 
  firstFilterSelected: false, 
  names: ["Home"], 
  exact_path: true, 
  folderFilterSelected: false 
}, action) => {
    switch (action.type) {
      case types.FOLDER_CLICKED:
        return {
          ...state,
          exact_path: true,
          firstFilterSelected: false,
          ...action.payload
        };
      case types.FOLDER_FILTER_SELECTED:
        return {
            ...state,
            folderFilterSelected: true,
          }
      case types.SET_EXACT_PATH:
        return {
          ...state,
          exact_path: !state.exact_path
        }
      case types.ALLOW_EXACT_PATH:
        return {
          ...state,
          exact_path: true
        }
      case types.DISALLOW_EXACT_PATH:
        return {
          ...state,
          exact_path: false
        }
      case types.SELECT_FIRST_FILTER:
        return {
          ...state,
          firstFilterSelected: true
        }
      default:
        return state
    }
  };