import playerPack from './player';
import parametersPack from './parameters';
import { combineReducers } from "redux";
import reducerFactory from "@bit/kubric.redux.reducers.factory";
import types from './types';
import creativesSelectors from '../creatives/selectors';

export default combineReducers({
  player: playerPack.reducer,
  parameters: parametersPack.reducer,
  ...reducerFactory({
    reducers: {
      currentCreative: {
        defaultState: 0,
        config: [{
          types: [types.NEXT_CREATIVE],
          transform(val, state) {
            const maxCount = creativesSelectors.getSelectedRowsCount();
            const proposedCount = state + 1;
            return proposedCount > maxCount ? maxCount : (state + 1);
          }
        }, {
          types: [types.PREVIOUS_CREATIVE],
          transform(val, state) {
            const proposedCount = state - 1;
            return proposedCount < 0 ? 0 : proposedCount;
          }
        }]
      }
    }
  })
});