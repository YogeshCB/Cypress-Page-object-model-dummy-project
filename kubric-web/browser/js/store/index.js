import reducers from './objects';
import loggerWare from './middlewares/logger';
import uploadWare from './middlewares/uploader';
import rtManager from './middlewares/rtmanager';
import reduxThunk from 'redux-thunk';
import assetWares from './middlewares/assetuploader';
import Throttler from "./middlewares/Throttler";
import { enableBatching } from "@bit/kubric.redux.reducers.utils";
//This is a required import to register all listeners for real time updates
import listeners from './objects/listeners';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { utilTypes } from "./objects/commons/types";

export const throttler = new Throttler();

const App = enableBatching(combineReducers(reducers), {
  batchType: utilTypes.BATCHED_ACTION
});

const middlewares = [reduxThunk, throttler.getWare()];

if (__kubric_config__.env !== 'production') {
  middlewares.push(loggerWare);
}

middlewares.push(rtManager, ...assetWares, uploadWare);

export default createStore(App, applyMiddleware(...middlewares));