import { combineReducers } from 'redux';
import insightsListPack from '../lists/insights';

export default combineReducers({
  data: insightsListPack.reducer,
});