import getTypes, { validTypes } from "../types";
import byId from './byid';
import stats from './stats';

const allIds = (state = [], action, types) => {
  const { extraData = {} } = action.payload;
  const { __key__: key } = extraData;
  switch (action.type) {
    case types.UPLOAD_INITIATED:
      return [key, ...state];
    default:
      return state;
  }
};

export default (state = {}, action) => {
  const splits = action.type.split('/');
  if (splits.length === 5 && splits[0] === 'kubric' && splits[1] === 'uploader' && validTypes[splits[4]]) {
    const target = splits[2];
    const type = splits[3];
    const targetKey = `${target}/${type}`;
    const types = getTypes(target, type);
    return {
      byId: byId(state.byId, action, types),
      allIds: allIds(state.allIds, action, types),
      stats: stats(state.stats, action, targetKey, types),
    }
  } else if (splits.length === 5 && splits[4] === 'PURGE_UPLOAD_STATS') {
    return {
      ...state,
      byId: {},
      allIds: [],
      stats: {}
    }
  } else {
    return state;
  }
};