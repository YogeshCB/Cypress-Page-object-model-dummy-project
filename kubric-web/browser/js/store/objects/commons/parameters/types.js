import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default id => getTypes([
  'SHOT_SELECTED',
  'PARAMETER_CHANGED',
  'PARAMETER_LOADING',
  'PARAMETER_LOADED'
], `kubric/packs/parameters/${id}`);