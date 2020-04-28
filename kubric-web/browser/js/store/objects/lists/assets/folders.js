import store from '../../..';
import config from '../../../../config';
import assetTypes from '../../assets/types';
import services from '../../../../services';
import { getFolderAssets, newFolder } from "../../servicetypes";
import assetSelectors from '../../assets/selectors';
import { at } from '@bit/kubric.utils.common.lodash';
import listFactory, { hooks } from '@bit/kubric.redux.packs.list';

const assetsConfig = config.assets;

const LIST_NAME = 'folderAssets';

export default listFactory(LIST_NAME, {
  idField: 'id',
  service: {
    method: services.assets.getFolderAssets(),
    data: 'response.hits',
    types: getFolderAssets,
    totalHits: 'response.total',
    applied_filters: 'response.applied_filters'
  },
  types: {
    fetched: {
      [newFolder.INITIATED]: {
        data: 'extraData',
        query: 'serviceData.folderId'
      },
      [assetTypes.FOLDER_ASSETS_FETCHED]: {
        data: 'hits',
        totalHits: 'total',
        query: 'folderId'
      },
      [newFolder.COMPLETED]: {
        data: 'response',
        query: 'response.path'
      }
    },
  },
  hooks: {
    [assetTypes.HIDE_ASSETS]: {
      actions: [hooks.ROW_UNSELECTED]
    }
  },
  getPagingData({ serviceData = {} } = {}) {
    const { from = 0 } = serviceData;
    return {
      nextFrom: from + assetsConfig.pageSize,
    }
  },
  isCompleted(hits = []) {
    return hits.length < assetsConfig.pageSize
  },
  getServiceData(queryData = {}) {
    const path = assetSelectors.getNavPath();
    return {
      from: queryData.paging && queryData.paging.nextFrom,
      private: false,
      constraints: undefined,
      attributes: undefined,
      path,
    };
  },
  getListState() {
    return at(store.getState(), `assets.folderAssets`)[0];
  },
});
