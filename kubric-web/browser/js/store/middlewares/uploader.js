import { getUploadActions } from "../objects/uploads/actions";
import services from '../../services';
import { getFileKey } from "../../lib/utils";
import { at } from "@bit/kubric.utils.common.lodash";

const uploadFlow = (dispatch, service, serviceData, file, extraData, uploadActions) => {
  extraData = {
    ...extraData,
    __key__: getFileKey(file),
    description: file.name,
    time: (new Date()).getTime(),
  };
  dispatch(uploadActions.uploadInitiated({
    file,
    extraData,
  }));
  return service()
    .on('progress', ({ percent }) => {
      dispatch(uploadActions.uploadProgressed({
        progressPercent: percent,
        extraData,
      }));
    })
    .send({
      ...serviceData,
      file,
    })
    .then(response => {
      dispatch(uploadActions.uploadCompleted({
        response,
        extraData
      }));
      return response;
    })
    .catch(err => {
      console.log(err);
      dispatch(uploadActions.uploadFailed({
        err,
        extraData,
      }));
    });
};

export default store => next => action => {
  let { filetype, target, files, type, service, options = {}, title } = action || {};
  let { serviceData = {}, extraData = {} } = options;
  if (type === 'upload') {
    const uploadActions = getUploadActions(target, filetype);
    [service] = at(services, service);
    extraData = {
      ...extraData,
      title,
      type,
      target,
    };
    if (typeof files.length !== 'undefined') {
      const promises = [];
      [].forEach.call(files, file => promises.push(uploadFlow(store.dispatch, service, serviceData, file, extraData, uploadActions)));
      return Promise.all(promises);
    } else {
      return uploadFlow(store.dispatch, service, serviceData, files, extraData, uploadActions);
    }
  } else {
    return next(action);
  }
};
