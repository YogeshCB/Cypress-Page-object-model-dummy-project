import byId from './byid';
import stats from './stats';
import allIds from './allids';
import { combineReducers } from "redux";

export default conf => combineReducers({
  byId: byId.bind(null, conf),
  stats: stats.bind(null, conf),
  allIds: allIds.bind(null, conf),
});