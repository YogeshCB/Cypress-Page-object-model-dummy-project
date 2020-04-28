import parameterFactory from "../../commons/parameters";
import { at } from "@bit/kubric.utils.common.lodash";
import creativesListPack from "../creatives/list";
import types from './types';
import { isObject } from "@bit/kubric.utils.common.lodash";

const toString = target => isObject(target) ? JSON.stringify(target) : `${target}`;

export default parameterFactory("bulkedit", {
  reducer(state = [], action) {
    switch (action.type) {
      case types.INITIATED:
        const selectedAds = creativesListPack.selectors.getSelectedRows();
        if (selectedAds.length > 0) {
          return selectedAds.reduce((acc, { source = {} }, index) => {
            const { parameters = [] } = source;
            if (index === 0) {
              return JSON.parse(JSON.stringify(parameters));
            } else {
              return parameters.reduce((acc, shotParams, index) => {
                const refParams = acc[index];
                acc[index] = Object.keys(refParams).reduce((acc, key) => {
                  if (toString(refParams[key]) === toString(shotParams[key])) {
                    acc[key] = refParams[key];
                  }
                  return acc;
                }, {});
                return acc;
              }, acc);
            }
          }, []);
        }
      default:
        return state;
    }
  },
  getState() {
    const { default: store } = require("../../../../store");
    return at(store.getState(), 'campaign.bulkEdit.parameters')[0];
  }
});