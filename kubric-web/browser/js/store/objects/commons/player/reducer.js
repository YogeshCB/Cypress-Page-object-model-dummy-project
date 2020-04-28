import { combineReducers } from "redux";
import reducerFactory, { macros } from "@bit/kubric.redux.reducers.factory";

export default types => combineReducers(reducerFactory({
  reducers: {
    playing: {
      macro: macros.SWITCH,
      on: types.PREVIEW_PLAY,
      off: [types.PREVIEW_PAUSE, types.PREVIEW_RESTART]
    },
    startedPlaying: {
      macro: macros.SWITCH,
      on: types.PREVIEW_PLAY,
    },
    currentShot: {
      defaultState: 0,
      config: [{
        types: types.PLAYING_SHOT_CHANGED,
      }]
    }
  }
}));