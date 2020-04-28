import parameterFactory from "../../commons/parameters";
import { at } from "@bit/kubric.utils.common.lodash";
import reducerFactory from '@bit/kubric.redux.reducers.factory';
import types from "./types";

const { parameters: parametersReducer } = reducerFactory({
  reducers: {
    parameters: {
      defaultState: [],
      config: [{
        types: [types.CREATIVE_FETCHED],
        action: {
          from: 'source.parameters',
        },
        transform(val) {
          return Array.isArray(val) ? val : [val]
        }
      }]
    }
  }
});

export default parameterFactory("creative", {
  reducer: parametersReducer,
  getState() {
    const { default: store } = require("../../../../store");
    return at(store.getState(), 'campaign.creative.parameters')[0];
  }
});