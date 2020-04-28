import store from '../../../index';
import config from '../../../../config';
import { assetTypes } from '../../assets';
import { at } from '@bit/kubric.utils.common.lodash';
import listFactory from '@bit/kubric.redux.packs.list';
import assetSelectors from "../../assets/selectors/index";
import filterConfig from "./filters";

const assetsConfig = config.assets;

const LIST_NAME = 'uploading-assets';

export default listFactory(LIST_NAME, {
  idField: 'id',
  types: {
    fetched: {
      [assetTypes.FOLDER_UPLOADS_FETCHED]: {
        data: 'data',
        filters: {
          private: true
        }
      },
    },
  },
  filterConfig,
  isCompleted(hits = []) {
    return hits.length < assetsConfig.pageSize
  },
  getFilterKeySuffix(payload = {}) {
    let { path = '' } = payload;
    if (path.length === 0) {
      path = assetSelectors.getAssetPath();
    }
    return `__path__${path}`;
  },
  getListState() {
    return at(store.getState(), `assets.uploads`)[0];
  },
});
