import reducerFactory from '@bit/kubric.redux.reducers.factory';
import { at, isNull, isUndefined } from "@bit/kubric.utils.common.lodash";
import config from "../../../../config";
import creativeTypes from "../creative/types";
import { campaignConfig } from "./commons";
import bulkEditTypes from "../bulkedit/types";

const processShots = shots => shots.map(({ template = {}, params = {}, defaultVideo }) => ({
  template,
  defaultVideo,
  parameters: Object.keys(params).reduce((acc, paramId) => {
    acc[paramId] = at(params, `${paramId}.default`)[0];
    return acc;
  }, {})
}));

const sbResponseTransformer = (storyboards, state = []) =>
  (Array.isArray(storyboards) ? storyboards : [storyboards])
    .reduce((acc, { uid, shots }) =>
      acc.map(sb => {
        const { id } = sb;
        if (id === uid) {
          shots = processShots(shots);
          return {
            ...sb,
            loaded: true,
            shots
          }
        } else {
          return sb;
        }
      }), state);

const campaignResponseTransformer = ({ template, storyboard_ids: ids = [], storyboard_versions: versions = [] }) => {
  if (!isUndefined(template) && !isNull(template)) {
    return [{
      shots: processShots(template.storyboard),
      loaded: true
    }];
  } else {
    return ids.map((id, index) => ({
      id,
      version: isUndefined(versions[index]) ? config.defaultSBVersion : versions[index],
      loaded: false
    }));
  }
};

const reducers = reducerFactory({
  reducers: {
    storyboards: {
      defaultState: [],
      transform: campaignResponseTransformer,
      config: [
        ...campaignConfig,
        {
          types: creativeTypes.STORYBOARD_FETCHED,
          transform: sbResponseTransformer
        },
        {
          types: bulkEditTypes.STORYBOARDS_FETCHED,
          transform: sbResponseTransformer,
          action: {
            from: 'storyboards'
          }
        }
      ]
    }
  }
});

export default reducers.storyboards;