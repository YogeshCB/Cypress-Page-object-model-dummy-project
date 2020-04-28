import { combineReducers } from "redux";
import flagReducer from '@bit/kubric.redux.reducers.flag';
import types from "./types";
import assetListPack from '../lists/assets/index';
import { getAssets } from "../servicetypes";

const initState = {
  network: 'kubric',
  open: false,
  single: true,
  type: 'image'
}

const updateState = (state, payload) => {
  return {
    ...state,
    ...payload
  }
}
const config = (state = initState, action) => {
  switch (action.type) {
    case types.TYPE_CHANGED:
    case types.PICK_ASSET:
    return updateState(state, action.payload)
    default:
      return state
  }
}


export default combineReducers({    
  data: assetListPack.reducer,
  config,
  ...flagReducer('open', {
    toggle: types.PICK_ASSET
  }),
  ...flagReducer('showFilter', {
    on: types.OPEN_FILTERS,
    off: types.CLOSE_FILTERS
  }, {
    defaultValue: true
  }),
  ...flagReducer('loading', {
    on: getAssets.INITIATED,
    off: getAssets.COMPLETED
  }, {
    defaultValue: true
  })
})