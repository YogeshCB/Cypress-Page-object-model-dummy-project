import assetUploadPack from "../../objects/assets/fileuploads";
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import { getFileKey } from "../../../lib/utils";
import Queue from '../../../lib/queue';
import assetTypes from "../../objects/assets/types";
import assetActions from "../../objects/assets/actions";

const BATCH_SIZE = 5;

let queue;

const getFiles = files => {
  let filesArr = [];
  if (!isUndefined(files.length)) {
    [].forEach.call(files, file => filesArr.push(file));
  } else {
    filesArr.push(files);
  }
  return filesArr;
};

/**
 * Process in batches recursively
 */
const processInBatches = (store, payloads = [], files = [], responses = []) => {
  const batch = payloads.splice(0, BATCH_SIZE);
  if (batch.length > 0) {
    const promises = batch.map(payload => store.dispatch(assetActions.fileUpload(payload)));
    return Promise.all(promises)
      .then(resp => {
        responses = [...responses, ...resp];
        return files.length > 0 ? processInBatches(store, payloads, files, responses) : responses;
      });
  }
  return Promise.resolve(responses);
};

export default store => next => action => {
  let { type } = action;
  const { actions } = assetUploadPack;

  const batchWorker = (data, resolve, reject) => {
    const { payloads, filesArr } = data;
    processInBatches(store, payloads, filesArr)
      .then(resolve)
      .catch(reject);
  };
  /**
   * Trigger the upload initiated action for  all the files
   */
  const triggerUploadInitiated = filesArr => {
    let { path = '/root', tags, attributes } = action.payload || {};
    const data = {
      tags,
      attributes,
      time: (new Date()).getTime(),
    };
    const fileData = filesArr.map(file => {
      let fileObject = file;
      let filePath = path;
      if (!isUndefined(file.file)) {
        fileObject = file.file;
        filePath = file.path;
      }
      const key = getFileKey(file, filePath);
      return ({
        ...data,
        file: fileObject,
        path: filePath,
        asset_type: 'loading_asset',
        id: key,
        url: "None",
        selectable: false,
        hoverable: false,
        actionable: false,
        key,
        name: file.name,
        description: file.name
      });
    });
    store.dispatch(actions.initiated({
      appendAt: 'start',
      path,
      data: [...fileData]
    }));
    return fileData;
  };

  //Setting up queue
  if (isUndefined(queue)) {
    queue = new Queue();
    queue.registerWorker(batchWorker);
  }

  //checking for type
  if (type === assetTypes.FILE_UPLOAD) {
    const { payload = {} } = action;
    let { files } = payload;
    if (!isUndefined(files)) {
      const filesArr = getFiles(files);
      if (filesArr.length > 0) {
        const payloads = triggerUploadInitiated(filesArr);
        return queue.add({
          payloads,
          filesArr,
          action
        });
      } else {
        return next(action);
      }
    } else {
      return next(action);
    }
  } else {
    return next(action);
  }
}