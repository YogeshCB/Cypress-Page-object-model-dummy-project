import {
    transform,
    filter
  } from "../../servicetypes";
import assetListPack from "../../lists/assets/index";

const formations = {
  RESIZE: 'resize',
  FILTER: 'filter',
  ROTATE: 'rotate',
  CROP: 'crop'
};

const DEFAULT_STATE = {
  data: {
    x0: 0,
    x1: 0,
    y0: 0,
    y1: 0,
    rotateBy: 0
  },
  resize: {
    w: 1,
    h: 1,
    as: ''
  },
  form: '',
  urls: [],
  selected: '',
  loading: false
}

export default (types, state = DEFAULT_STATE, action) => {
    switch (action.type) {
      case types.TRANSFORM_EDIT:
        return {
          ...state,
          data: {
            ...state.data,
            ...action.payload
          }
        };
      case types.SHOW_TRANSFORMATION:
        return {
          ...state,
          selected: formations[action.payload]
        };
      case types.HIDE_TRANSFORMATION:
        return {
          ...state,
          selected: '',
          urls: []
        };
      case filter.INITIATED:
      case transform.INITIATED:
        return {
          ...state,
          loading: true,
        };
      case types.SET_FORM:
        return {
          ...state,
          form: action.payload
        };
      case filter.COMPLETED:
      case transform.COMPLETED:
      case filter.FAILED:
      case transform.FAILED:
        return {
          ...state,
          loading: false,
          data: {
            ...DEFAULT_STATE.data
          },
          urls: {
            ...state.urls,
            [action.payload.serviceData.assetId]: action.payload.response.url
          }
        };
      case types.PURGE_TRANSFORM_DATA:
      case assetListPack.types.ROW_SELECTED:
        return DEFAULT_STATE;
      default:
        return state;
    }
  };

