import pickerActions from './actions';
import assetListPack from '../lists/assets/index';
import assetActions from '../assets/actions';
import services from "../../../services";
import { isUndefined } from 'util';

export const applyFilters = {
    kubric: (type, meta) => {
        if (meta.meta) {
            let filtersParams = {
                private: true,
                auto_gen: true,
                type
            }
            const keys = Object.keys(meta.meta);
            keys.map(key=>{                
                if(key === 'tags') {
                    filtersParams = {
                        ...filtersParams,
                        query: meta.meta[key].toString()
                    }
                }
                else if (key === 'or') {
                    filtersParams = {
                        ...filtersParams,
                        or: meta.meta[key]
                    }
                }
                else if (key === 'co') {
                    filtersParams = {
                        ...filtersParams,
                        co: meta.meta[key].charAt(0)==='#'?meta.meta[key].substr(1,meta.meta[key].length):meta.meta[key]
                    }
                }
                else if (key === 'tr') {
                    filtersParams = {
                        ...filtersParams,
                        tr: meta.meta[key]
                    }
                }
            })
            return filtersParams
        }
        else {
            return {
                private: true,
                auto_gen: true,
                type
            }
        }
    }
}

const filters = {
    tags: (meta) => ({
        id: 'query',
        input: 'single',
        value: 'query',
        editable: true,
        data: { value: meta.tags.toString(), label: meta.tags.toString() }
    }),
    private: () => ({
        label: 'Public Assets Only',
        id: 'private',
        input: 'single',
        value: 'private',
        editable: false,
        data: { value: "true", label: 'Me' }
    }),
    is_banner: (meta) => ({
        label: 'Non Banners',
        input: 'single',
        editable: true,
        id: 'is_banner',
        value: 'is_banner',
        data: { value: meta.is_banner, label: meta.is_banner }
    }),
    co: (meta) => ({
        label: 'Color',
        input: 'single',
        editable: true,
        value: 'co',
        id: 'co',
        data: { value: meta.co.charAt(0)==='#'?meta.co.substr(1,meta.co.length):meta.co, label: meta.co }
    }),
    or: (meta) =>({
        label: 'Aspect Ratio',
        input: 'single',
        editable: true,
        id: 'or',
        value: 'or',
        data: { value: meta.or, label: meta.or }
    }),
    tr: (meta) => ({
        label: 'Transparency',
        input: 'single',
        editable: true,
        id: 'tr',
        value: 'tr',
        data: { value: meta.tr, label: meta.tr }
    }),
    auto_gen: (meta) => ({
        label: 'Uploaded Assets Only',
        input: 'single',
        editable: true,
        id: 'auto_gen',
        value: 'auto_gen',
        data: { value: meta.auto_gen, label: meta.auto_gen }
    }),
    mop: (meta) => ({
        label: 'Model/Product',
        input: 'single',
        editable: true,
        id: 'mop',
        value: 'mop',
        data: { value: meta.mop, label: meta.mop }
    }),
    gender: (meta) => ({
        label: 'Gender',
        input: 'single',
        editable: true,
        id: 'gender',
        value: 'gender',
        data: { value: meta.gender, label: meta.gender }
    }),
    type: (meta) => ({
        label: typeMap[meta.type],
        input: 'single',
        editable: false,
        id: 'type',
        value: 'type',
        data: { value: meta.type, label: typeMap[meta.type] }
    })
}
export const filterSelected = {
    kubric: (type, meta) => dispatch => {
        const filterKeys = meta.meta && Object.keys(meta.meta);
        dispatch(assetListPack.actions.filterSelected(filters['private']()));
        dispatch(assetListPack.actions.filterSelected(filters['auto_gen']({ auto_gen: true})));
        dispatch(assetListPack.actions.filterSelected(filters['type']({type})));   
        Array.isArray(filterKeys) && filterKeys.length > 0 && filterKeys.map(key=> {
            filters[key] && dispatch(assetListPack.actions.filterSelected(filters[key](meta.meta)))
        })
    }
}

const buildServiceData = (id, filterQuery, value) => {
    if (id === 'tr' || id === 'co' || id === 'or' || id === 'so' || id === 'mop') {
        if (filterQuery.constraints && filterQuery.constraints[id] && filter.input === 'multiple') {
          filterQuery = {
            ...filterQuery,
            constraints: {
              ...filterQuery.constraints,
              [id]: `${filterQuery.constraints[id]}#$!%#${value}`
            }
          }
        } else {
          filterQuery = {
            ...filterQuery,
            constraints: { ...filterQuery.constraints, [id]: value }
          }
        }
      } else if (id === 'location' || id === 'gender' || id === 'is_banner') {
        if (filterQuery.attributes && filterQuery.attributes[id]) {
          filterQuery = {
            ...filterQuery,
            attributes: {
              ...filterQuery.attributes,
              [id]: `${filterQuery.attributes[id]},${value}`
            }
          }
        } else {
          filterQuery = {
            ...filterQuery,
            attributes: { ...filterQuery.attributes, [id]: value }
          }
        }
      } else if (id === 'tags') {
          filterQuery = {
            ...filterQuery,
            query: value.toString()
          }
      }
      return filterQuery
}

const filterServiceData = (meta) => {
    if(!isUndefined(meta.meta)){
        const filters = Object.keys(meta.meta);
        let serviceData = {};
        filters.map(filter=>{          
            serviceData = buildServiceData(filter, serviceData, meta.meta[filter])
        })
        return serviceData
    }
    else {
        return {}
    }
}

export const getServiceData = {
    kubric: (type, meta) => ({
        type,
        private: true,
        exclude: {
            auto_gen: true
        },
        ...filterServiceData(meta)
    }),
    cloudinary: (type) => ({
        type,
        private: true
    })
}
const fetchFilters = () => () => {
    return services.assets.getFilters().notifyStore().send()
}

export const typeMap = {
    'image': "Images",
    'audio': "Audio",
    'video': "Videos",
}

export const prefetchedHandlers = {
    kubric: (type, meta) => dispatch => {
        dispatch(filterSelected['kubric'](type, meta));
        dispatch(fetchFilters())
        .then(res => {
            const filters = res.filters.filter(flt=> flt.id !== 'type' && flt.id !== 'private');
            dispatch(assetListPack.actions.filterSourceChanged(filters));
        });
    }
}

export const postFetchHandlers = {
    kubric: (res, meta, type) => dispatch => {
        dispatch(pickerActions.pickerAssetsFetched({
            ...res, 
            filters: {
                ...applyFilters['kubric'](type, meta)
            }
        }));    
        dispatch(pickerActions.openFilters());
    },
    cloudinary: (res) => dispatch => {
        dispatch(assetListPack.actions.filterSelected({
            label: 'Public Assets Only',
            id: 'private',
            input: 'single',
            value: 'private',
            editable: true,
            data: { value: "true", label: 'Me' }
        }));
        dispatch(assetActions.assetsFetched(res));
        dispatch(pickerActions.closeFilters());
    }
}
