import Folder from './Folder';
import assetTypes from "../../../objects/assets/types";
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import assetSelectors from "../../../objects/assets/selectors";

const getParentFolder = () => {
  const path = assetSelectors.getNavPath();
  const splits = path.replace(/^\//, '').split('/');
  const parent = splits.pop();
  return new Folder({
    id: parent,
    path: `${splits.join('/')}`
  });
};

const getFiles = files => {
  if (Array.isArray(files)) {
    return files;
  } else if (!isUndefined(files.length)) {
    return [].map.call(files, file => file);
  } else {
    return [files];
  }
};

export default store => next => action => {
  let { type } = action;

  if (!Folder.initialized) {
    Folder.init(store);
  }
  if (type === assetTypes.FOLDER_UPLOAD) {
    let { files } = action.payload;
    files = getFiles(files);
    const parentFolder = getParentFolder();
    files.forEach(file => {
      const { webkitRelativePath, calculatedPath } = file;
      const filePath = webkitRelativePath.length > 0 ? webkitRelativePath : calculatedPath;
      const paths = filePath.split('/');
      paths.pop();
      parentFolder.addFileToPath(paths, file);
    });
    return parentFolder.createAll();
  }
  return next(action);
};
