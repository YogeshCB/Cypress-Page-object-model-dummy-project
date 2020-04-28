import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'PARAMETER_CHANGED',
    'STORYBOARDS_FETCHED',
    'SHOT_SELECTED',
    'INITIATED',
    'NEXT_CREATIVE',
    'PREVIOUS_CREATIVE'
  ], 'kubric/campaign/bulkedit'),
};