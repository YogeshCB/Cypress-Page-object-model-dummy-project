import services from '../../../services';
import assetUploadPack from '../../objects/assets/fileuploads';
import assetListPack from '../../objects/lists/assets';
import assettasksActions from '../../objects/assettasks/actions';
import { getFileExtension, getFileKey } from "../../../lib/utils";
import assetTypes from "../../objects/assets/types";
import notificationActions from '../../objects/notifications/actions';
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import { assetWhiteList } from "../../../lib/constants";
import assetSelectors from "../../objects/assets/selectors/index";
import assetActions from '../../objects/assets/actions';

const MAX_ASSET_CHECK = 5;

const errHandler = (store, actions, data, key, file, err) => {
  data = {
    ...data,
    hasErred: true,        
    selectable: false,
    actionable: false,
    message: 'Upload Failed',
    hoverable: false,
    asset_type: 'loading_asset',
    url: "None"        
  };
  store.dispatch(actions.failed({
    data,
    key,
    file,
    err,
  }));
  if(key){
    store.dispatch(assetListPack.actions.replaceRow({
      old: key,
      new: {
        ...data,
        name: file.name,
        title: file.name,
        file,
        id: key,
        hasErred: true,        
        selectable: false,
        actionable: false,
        message: 'Upload Failed',
        hoverable: false,
        asset_type: 'loading_asset',
        url: "None"        
      }
    })); 
  }
};

const checkUploadProcessed = (dispatch, actions, data, asset) => {
  let assetCheckCount = 1;
  const { key } = data;

  return services.assets.getAsset()
    .send(asset)
    .then(response => {
      if (typeof response.url !== 'undefined') {
        dispatch(actions.completed({
          data,
          key,
          response
        }));
        return response;
      } else {
        if (assetCheckCount <= MAX_ASSET_CHECK) {
          setTimeout(checkUploadProcessed.bind(null, dispatch, actions, data, asset), 2000);
          assetCheckCount++;
        } else {
          throw new Error(`Unable to confirm uploaded asset ${asset.filename}`);
        }
      }
    });
};

const confirmAssetUpload = (dispatch, asset, actions, data, file) =>
  services.assets.confirmUpload()
    .send(asset)
    .then(checkUploadProcessed.bind(null, dispatch, actions, data))
    .catch(errHandler.bind(null, dispatch, actions, data, asset.id, file));

const assetUploadFlow = (dispatch, file, data, actions, urlResp = []) => {
  const asset = urlResp[0];
  const { key: tempKey } = data;
  const { url, type, id: assetId, path } = asset;
  const folderId = path.split('/').pop();
  dispatch(actions.replaceEntry({
    old: tempKey,
    new: assetId
  }));
  dispatch(assetListPack.actions.replaceRow({
    old: tempKey,
    new: assetId
  }));
  dispatch(assettasksActions.replaceTaskRow({
    old: tempKey,
    new: assetId
  }));
  //This is a trigger to register the firebase task to check for newly added children
  dispatch(assetActions.assetUploadInitiated({
    folderId
  }));
  data = {
    ...data,
    key: assetId
  };

  return services.assets[type === 'font' ? 'uploadFont' : 'upload']()
    .overrideUrl(url)
    .on('progress', (e) => {
      const assetData = assetSelectors.getAsset(assetId);
      if(assetData.progress <  parseInt(((e.percent) / 100) * 40) ) {
        dispatch(assetListPack.actions.replaceRow({
          old: assetId,
          new: {
            ...data,
            id: assetId,
            key: assetId,
            selectable: true,
            actionable: true,
            hoverable: true,
            file,
            asset_type: 'loading_asset',
            url: "None",
            progress: parseInt(((e.percent) / 100) * 40) 
          }
        }))
      }      
      dispatch(actions.progressed({
        file,
        key: assetId,
        id: assetId,
        data,
        progressPercent: e.percent, 
        fraction: parseInt(e.total/1024)>0?e.total>1000000?`${parseInt(e.loaded/1024/1024)} / ${parseInt(e.total/1024/1024)} MB`:`${parseInt(e.loaded/1024)} / ${parseInt(e.total/1024)} KB`:''
      }));
    })
    .send(file)
    .then(confirmAssetUpload.bind(null, dispatch, asset, actions, data, file))
    .catch(errHandler.bind(null, dispatch, actions, data, assetId, file));
};

export default store => next => action => {
  let { type } = action;
  let { file, title, path, tags, attributes, key: tempKey } = action.payload || {};
  
  const { actions } = assetUploadPack;
  if (type === assetTypes.FILE_UPLOAD && !isUndefined(file)) {
    const extension = getFileExtension(file);
    //Avoiding hidden files(filenames starting with .) and non-whitelisted files
    if (!/^\./.test(file.name) && assetWhiteList.has(extension.toLowerCase())) {
      const data = {
        key: tempKey || getFileKey(file, path),
        tags,
        path,
        title: title || file.name,
        attributes,
        name: file.name,
        filetype: file.type
      };

      return services.assets
        .getUploadUrls()
        .send({
          path,
          files: [file.name],
          tags,
          attributes
        })
        .then(assetUploadFlow.bind(null, store.dispatch, file, data, actions))
        .catch(errHandler.bind(null, store, actions, data, tempKey, file));
    }
    else {
      store.dispatch(notificationActions.addNotification({
        type: 'error',
        heading: `Could not upload ${file.name}`
      }))
    }
  } else {
    return next(action);
  }
};
