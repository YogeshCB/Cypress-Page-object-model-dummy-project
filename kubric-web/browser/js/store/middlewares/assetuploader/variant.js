import services from '../../../services';
import assetUploadPack from '../../objects/assets/fileuploads';
import notificationActions from '../../objects/notifications/actions';
import assetListPack from '../../objects/lists/assets';
import { getFileExtension, getFileKey } from "../../../lib/utils";
import assetTypes from "../../objects/assets/types";
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import { assetWhiteList } from "../../../lib/constants";
import assetSelectors from "../../objects/assets/selectors/index";
import assetActions from '../../objects/assets/actions';


const errHandler = (dispatch, actions, data, key, err) => {
  console.log(err);
  dispatch(actions.failed({
    data,
    key,
    err,
  }));
};

const assetUploadFlow = (dispatch, file, data, actions, urlResp = []) => {
  const asset = urlResp[0];
  const { url, blobname, filename  } = asset;
  const { key } = data;
  
  const assetId = assetListPack.selectors.getSelectedIds()[0];
  return services.assets.upload()
    .overrideUrl(url)
    .on('progress', (e) => {
      dispatch(actions.progressed({
        key,
        data,
        title: filename,
        progressPercent: e.percent, 
        fraction: parseInt(e.total/1024)>0?e.total>1000000?`${parseInt(e.loaded/1024/1024)} / ${parseInt(e.total/1024/1024)} MB`:`${parseInt(e.loaded/1024)} / ${parseInt(e.total/1024)} KB`:''
      }));
    })
    .send(file)
    .then((response)=>{
        const assetVariant = assetSelectors.getAsset(assetId);
        
        dispatch(assetActions.uploadModal());
        services.assets.saveVariant()
        .notifyStore()
        .send({
          op: 'create_version',
          id: assetId,
          versions: [{
              url: `https://storage.googleapis.com/${response.bucket}/${response.name}`,
              name: filename,
              blobname,
              make_default: false,
          }]
        }).then(res=>{
          assetActions.isVariant();     
          dispatch(actions.completed({
            data,
            key,
            response
          }));     
          dispatch(assetListPack.actions.replaceRow({
            old: assetVariant.id,
            new: {
              ...assetVariant,
              versions: assetVariant.versions?[
                res.version,
                ...assetVariant.versions,
              ]:[res.version]
            }
          } ) );
          dispatch(assetListPack.operations.onRowSelected({id:assetVariant.id}));
          dispatch(notificationActions.addNotification({
            type: 'success',
            heading: 'Version Successfully Saved',
          }));
          dispatch(assetActions.setForm('version'));
        })
    })
    .catch(errHandler.bind(null, dispatch, actions, data, key));
};

export default store => next => action => {
  let { type } = action;
  let { file, title } = action.payload || {};
  const { actions } = assetUploadPack;
  if (type === assetTypes.VARIANT_UPLOAD && !isUndefined(file)) {
    const extension = getFileExtension(file);
    const variant = assetSelectors.isVariant();
    
    //Avoiding hidden files(filenames starting with .) and non-whitelisted files
    if (!/^\./.test(file.name) && assetWhiteList.has(extension)) {
      const data = {
        key: getFileKey(file),
        title: title || file.name,
        name: file.name,
        filetype: file.type
      };
      return services.assets
        .getUploadUrls()
        .send({
          files: [file.name],
          variant
        })
        .then(assetUploadFlow.bind(null, store.dispatch, file, data, actions))
        .catch(errHandler.bind(null, store.dispatch, actions, data));
    }
  } else {
    return next(action);
  }
};
