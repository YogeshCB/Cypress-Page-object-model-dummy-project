import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default getTypes([
  'PROFILE_FETCHED',
  'PROFILE_DATA_CHANGED',
  'NETWORK_SETTING_CHANGE',
  'INTEGRATIONS_FETCHED',
  'NETWORK_UI_CHANGE',
  'CURRENT_PUBLISHER_CHANGE',
  'CURRENT_ASSET_CHANGE',
  'SETTING_LOADING',
], 'kubric/profile');