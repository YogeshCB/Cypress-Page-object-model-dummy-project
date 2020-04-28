import store from '../../../index';
import filterConfig from './filters';
import config from '../../../../config';
import assetTypes from '../../assets/types';
import pickerTypes from '../../picker/types';
import services from '../../../../services';
import { getAssets } from "../../servicetypes";
import assetUploadPack from "../../assets/fileuploads";
import assetSelectors from '../../assets/selectors/index';
import { attributeChanged, attributeDeleted } from './reducers';
import { at, isUndefined } from '@bit/kubric.utils.common.lodash';
import listFactory, { hooks, controllers } from '@bit/kubric.redux.packs.list';

const assetsConfig = config.assets;

const LIST_NAME = 'assets';

const loadingAssets = new Set(['loading_asset', 'inactive_folder']);
const tempAssets = new Set(['loading_asset', 'inactive_folder', 'active_folder']);

export default listFactory(LIST_NAME, {
  idField: 'id',
  service: {
    method: services.assets.getAssets(),
    data: 'response.hits',
    types: getAssets,
    totalHits: 'response.total',
    applied_filters: 'response.applied_filters'
  },
  types: {
    fetched: {
      [assetTypes.ASSETS_FETCHED]: {
        data: 'hits',
        append: 'appendAt',
        totalHits: 'total',
        filters: {
          private: true
        }
      },
      [pickerTypes.PICKER_ASSETS_FETCHED]: {
        data: 'hits',
        append: 'appendAt',
        totalHits: 'total',
        filters: 'filters'
      },
      [assetUploadPack.types.INITIATED]: {
        data: 'data',
        append: 'appendAt',
        filters: {
          private: true
        }
      },
      [assetTypes.FOLDER_UPLOADS_FETCHED]: {
        data: 'hits',
        append: 'appendAt',
        filters: {
          private: true
        }
      }
    },
  },
  hooks: {
    [assetTypes.HIDE_ASSETS]: {
      actions: [hooks.ROW_UNSELECTED]
    }
  },
  controllers: {
    //[controllers.SELECTION_CONTROLLER]: ({ asset_type: type }) => !loadingAssets.has(type),
    //[controllers.PURGE_CONTROLLER]: ({ asset_type: type }) => !tempAssets.has(type),
    /* [controllers.FETCH_CONTROLLER]: (data = []) => {
      const createdAssets = data.filter(({ asset_type: type }) => !tempAssets.has(type));
      return createdAssets.length === 0;
    }*/ 
  },
  filterConfig,
  getPagingData({ serviceData = {} } = {}) {
    const { from = 0 } = serviceData;
    return {
      nextFrom: from + assetsConfig.pageSize,
    }
  },
  isCompleted(hits = []) {
    const loadingHits = hits.filter(({ asset_type: type }) => loadingAssets.has(type));
    return loadingHits.length !== hits.length && hits.length < assetsConfig.pageSize;
  },
  getServiceData(queryData = {}) {
    const path = assetSelectors.getAssetPath();
    const exact_path = assetSelectors.getExactPath();
    const isFolderFilterSelected = assetSelectors.getFolderFilterStatus();    
    if((exact_path === true || exact_path === 'true')) {
      if(isFolderFilterSelected){
        return  {
          from: queryData.paging && queryData.paging.nextFrom,
          path,
          exclude: undefined
        };
      }
      else {
        return  {
          from: queryData.paging && queryData.paging.nextFrom,
          path,
          exclude: 'asset_type:folder'
        };
      }
    }
    else {
      return  {
        from: queryData.paging && queryData.paging.nextFrom,
      };
    }
  },
  getListState() {
    return at(store.getState(), `assets.data`)[0];
  },
  getFilterKeySuffix(payload = {}) {
    let { path = '', extraData = {} } = payload;
    if (path.length === 0) {
      path = !isUndefined(extraData.parent) ? extraData.parent : assetSelectors.getNavPath();
    }
    return `__path__${path === 'root' ? '/' : ''}${path}`;
  },
  getFilterQueryParams(filters, parsedFilters) {
    let path = assetSelectors.getAssetPath();
    let exact_path = assetSelectors.getExactPath();
    
    let filterQuery = parsedFilters;
    filters && filters.map(filter => {
      const { id } = filter;
      if (id === 'tr' || id === 'co' || id === 'or' || id === 'so' || id === 'mop') {
        if (filterQuery.constraints && filterQuery.constraints[id] && filter.input === 'multiple') {
          filterQuery = {
            ...filterQuery,
            constraints: {
              ...filterQuery.constraints,
              [id]: `${filterQuery.constraints[id]}#$!%#${filter.data.value}`
            }
          }
        } else {
          filterQuery = {
            ...filterQuery,
            constraints: { ...filterQuery.constraints, [id]: filter.data.value }
          }
        }
      } else if (id === 'location' || id === 'gender' || id === 'is_banner') {
        if (filterQuery.attributes && filterQuery.attributes[id]) {
          filterQuery = {
            ...filterQuery,
            attributes: {
              ...filterQuery.attributes,
              [id]: `${filterQuery.attributes[id]},${filter.data.value}`
            }
          }
        } else {
          filterQuery = {
            ...filterQuery,
            attributes: { ...filterQuery.attributes, [id]: filter.data.value }
          }
        }
      } else if (id === 'created_time') {
          filterQuery = {
            ...filterQuery,
            sortBy: { ...filterQuery.sortBy, [id]: filter.data.value }
          }
      } else if (id === 'auto_gen') {
          filterQuery = {
            ...filterQuery,
            exclude: {
              ...filterQuery.exclude,
              auto_gen: filter.data.value
            }
          }
      }
      if (filters.length === 1 && id === 'private') {
        exact_path = true;
      }
    });
    const isSortByPresent = filters.filter(flt => flt.id === 'created_time');
    const inFolderSearch = isSortByPresent.length > 0 && typeof filterQuery.query === 'undefined' && filters.length - 1 === isSortByPresent.length;

    let params = {
      ...filterQuery,
      query: filterQuery.query,
      path,
      exact_path
    }

    if (filters && filters.length > 1 && filterQuery.private === 'true') {
      if (inFolderSearch) {
        params = {
          ...params,
          exclude: 'asset_type:folder'
        }
      }
      else {
        params = {
          ...params,
          path: '/root'
        }   
      }
    }
    return params
  },
  reducers: {
    byId: {
      [assetTypes.ATTRIBUTE_CHANGED]: attributeChanged,
      [assetTypes.ATTRIBUTE_DELETED]: attributeDeleted,
    },
  },
});
