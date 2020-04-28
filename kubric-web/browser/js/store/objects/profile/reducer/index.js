import types from '../types';
import formErrorReducer from '../../commons/formerrors';
import { combineReducers } from 'redux';
import networks from './networks';
import { getAssignReducers } from "@bit/kubric.redux.reducers.payload";
import ui from './ui';
import account from './account';
import { unlinkDrive } from "../../servicetypes";

const currentAssetReducer = (state = -1, action) => {
  switch (action.type) {
    case unlinkDrive.COMPLETED:
      return -1;
    default:
      return state;
  }
};

export default combineReducers({
  formErrors: formErrorReducer('profile'),
  account,
  networks,
  ui,
  ...getAssignReducers({
    currentPublisher: {
      type: types.CURRENT_PUBLISHER_CHANGE,
      defaultState: -1,
    },
    currentAsset: {
      type: types.CURRENT_ASSET_CHANGE,
      defaultState: -1,
      reducer: currentAssetReducer,
    },
  }),
});
