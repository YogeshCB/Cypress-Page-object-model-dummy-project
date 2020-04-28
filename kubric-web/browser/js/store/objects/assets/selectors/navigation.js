import store from '../../../../store';

const assets = state => (state || store.getState()).assets;

const getNavPath = state => assets(state).path.navPath;

const getAssetPath = state => assets(state).path.path;

const getNames = state => assets(state).path.names;

const getExactPath = state => assets(state).path.exact_path;

const getFolderFilterStatus = state => assets(state).path.folderFilterSelected;

const getFirstFilterSelected = state => assets(state).path.firstFilterSelected;

const getCurrentFolderName  = state => {
  const names = getNames();
  return names[names.length - 1];
}

export default {
  getNavPath,
  getFirstFilterSelected,
  getFolderFilterStatus,
  getAssetPath,
  getCurrentFolderName,
  getNames,
  getExactPath
}