import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'NAME_CHANGED',
    'TYPE_CHANGED',
    'PAGE_CHANGED',
    'NEW_CAMPAIGN',
    'HIDE_MODAL',
    'STORYBOARDS_FETCHED',
    'QUERY_CHANGED',
    'CAMPAIGN_FETCHED',
    'ADS_WITH_MISSING_ASSETS_FETCHED',
    'ON_GENERATE_CONFIRMATION',
    'ON_CANCEL_CONFIRMATION',
    'CREATIVES_FETCHED',
    'STATS_FETCHED',
    'CREATIVES_LOADED'
  ], 'kubric/campaign'),
};