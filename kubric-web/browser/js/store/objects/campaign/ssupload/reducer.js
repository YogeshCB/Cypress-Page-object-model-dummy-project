import { createCampaign } from "../../servicetypes";
import { combineReducers } from 'redux';
import types from "./types";
import getUploadTypes from "../../uploads/types";
import reducerFactory, { macros } from "@bit/kubric.redux.reducers.factory";

const ssUploadTypes = getUploadTypes('creatives', 'csv');

export default combineReducers(reducerFactory({
  reducers: {
    modalOpened: {
      macro: macros.SWITCH,
      on: types.OPEN_UPLOAD,
      off: types.CLOSE_UPLOAD
    },
    isUploading: {
      macro: macros.SWITCH,
      on: createCampaign.INITIATED,
      off: [ssUploadTypes.UPLOAD_FAILED, types.AD_CREATION_PROGRESSED]
    },
    adCreationProgress: {
      defaultState: {
        message: '',
        progress: 0
      },
      defaultValue: {
        message: '',
        progress: 0
      },
      config: [{
        types: [types.AD_CREATION_PROGRESSED, types.CLOSE_UPLOAD],
      }]
    }
  }
}));