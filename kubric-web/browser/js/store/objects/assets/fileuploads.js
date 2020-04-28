import uploadFactory from '../uploads_new';
import { at } from "@bit/kubric.utils.common.lodash";

export default uploadFactory('asset_upload', {
  getState() {
    const { default: store } = require('../..');
    return at(store.getState(), 'assets.fileuploads')[0];
  }
});