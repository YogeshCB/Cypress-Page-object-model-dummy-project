import listPack from '../list';
import { combineReducers } from "redux";
import types from '../types';
import { creativeTabs } from "../../../../../../../isomorphic/constants/creatives";
import campaignTypes from '../../types';
import formData from './formdata';
import { composeReducers } from "@bit/kubric.redux.reducers.utils";
import tabCounts from './tabcounts';
import dummyReducer from '../../../commons/dummy';
import reducerFactory, { actions, macros } from "@bit/kubric.redux.reducers.factory";

const STATS_DEFAULT_STATE = {
  [creativeTabs.ALL]: 0,
  [creativeTabs.INPROGRESS]: {
    all: 0,
    generation: 0,
    publish: 0
  },
  [creativeTabs.FAILED]: {
    all: 0,
    missingAssets: 0,
    generation: 0,
    publish: 0
  },
  [creativeTabs.GENERATED]: 0,
  [creativeTabs.PUBLISHED]: 0,
  [creativeTabs.READY]: 0,
};

const reducers = reducerFactory({
  reducers: {
    progressBuffer: {
      action: actions.APPEND_PAYLOAD,
      defaultState: {},
      types: types.UPDATE_PROGRESS_BUFFER
    },
    stats: {
      defaultState: {
        ...STATS_DEFAULT_STATE
      },
      types: campaignTypes.STATS_FETCHED,
    },
    activeTab: {
      defaultState: creativeTabs.ALL,
      types: types.TAB_CHANGED,
    },
    view: {
      defaultState: 'table',
      types: types.VIEW_CHANGED,
    },
    panelTab: {
      defaultState: 'discuss',
      types: types.PANELTAB_CHANGED,
    },
    showFilters: {
      macro: macros.SWITCH,
      off: [listPack.types.ROW_SELECTED, types.TAB_CHANGED],
      toggle: types.TOGGLE_FILTERS
    },
    grid: {
      macro: macros.SWITCH,
      toggle: types.TOGGLE_GRID
    },
    loadingTabs: {
      defaultState: {},
      types: [types.TAB_LOADING, types.TAB_LOADED],
      action: actions.APPEND_PAYLOAD
    }
  }
});

export default composeReducers([
  combineReducers({
    formData,
    data: listPack.reducer,
    tabcounts: dummyReducer({}),
    ...reducers,
  }), tabCounts]);