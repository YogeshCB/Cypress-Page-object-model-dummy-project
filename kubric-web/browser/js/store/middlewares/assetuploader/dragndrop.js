import assetTypes from "../../objects/assets/types";
import assetActions from "../../objects/assets/actions";

export default store => next => action => {
  const { type } = action;
  if (type === assetTypes.DROP_UPLOAD) {
    const { payload = {} } = action;
    const { files = [], ...restPayload } = payload;
    if (files.length > 0) {
      const directFiles = [], folderFiles = [];
      files.forEach(file => {
        if (file.calculatedPath.length > 0) {
          folderFiles.push(file);
        } else {
          directFiles.push(file);
        }
      });
      folderFiles.length > 0 && setImmediate(() => store.dispatch(assetActions.folderUpload({
        ...restPayload,
        files: folderFiles,
      })));
      directFiles.length > 0 && setImmediate(() => store.dispatch(assetActions.fileUpload({
        ...restPayload,
        files: directFiles
      })));
    } else {
      return next(action);
    }
  } else {
    return next(action);
  }
}