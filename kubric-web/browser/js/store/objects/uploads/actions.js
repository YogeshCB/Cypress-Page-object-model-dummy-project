import getTypes from './types';
import { getActions } from "@bit/kubric.redux.reducks.utils";

const triggerAssetUpload = (target, filetype, title, files, path, tags, attributes) => dispatch => dispatch({
  type: 'asset_upload',
  filetype,
  target,
  files,
  path,
  tags,
  attributes,
  title,
});

const triggerUploadAtCampaignLevel = (target, filetype, service, title, files, options) => dispatch => dispatch({
  type: 'upload',
  target,
  filetype,
  title,
  files,
  service,
  options
});


export default {
  triggerAssetUpload,
  triggerUploadAtCampaignLevel
};

export const getUploadActions = (target, type) => getActions(getTypes(target, type));