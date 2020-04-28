import { at, bindFunctions, isUndefined } from "@bit/kubric.utils.common.lodash";
import { FAILED, INPROGRESS, SUCCESS, INITIATED } from "./constants";

const getById = (state, key) => !isUndefined(key) ? at(state, `byId.${key}`)[0] : undefined;

const getAllById = state => state.byId;

const getAllIds = state => state.allIds;

const getStats = state => state.stats;

const getInProgress = state => getStats(state)[INPROGRESS];

const getInInitiated = state => getStats(state)[INITIATED];

const getSuccess = state => getStats(state)[SUCCESS];

const getFailed = state => getStats(state)[FAILED];

const getState = state => state;

const selectors = {
  getState,
  getById,
  getAllIds,
  getAllById,
  getInInitiated,
  getStats,
  getInProgress,
  getFailed,
  getSuccess
};

export const getSelectors = (config = {}) => {
  const { getState } = config;
  return bindFunctions(selectors, getState, config);
};

export default selectors;