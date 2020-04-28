import { combineReducers } from "redux";
import types from './types';
import { isString } from "@bit/kubric.utils.common.lodash";
import reducerFactory from "@bit/kubric.redux.reducers.factory";
import { campaignConfig } from "../reducer";
import playerPack from './player';
import parametersPack from './parameters';

export default combineReducers({
  ...reducerFactory({
    types: {
      [types.CREATIVE_FETCHED]: [{
        config: {
          name: 'source.segment.name',
          source: 'source',
          id: 'uid',
          bindingIndex: "source.bindingIndex",
          meta: {
            from: 'meta',
            transform(val) {
              return isString(val) ? JSON.parse(val) : val;
            }
          },
        }
      }]
    },
    reducers: {
      name: '',
      source: {
        defaultState: {}
      },
      id: '',
      bindingIndex: {
        defaultState: 0,
        defaultValue: 0
      },
      meta: {
        defaultState: {}
      },
    }
  }),
  parameters: parametersPack.reducer,
  player: playerPack.reducer
});