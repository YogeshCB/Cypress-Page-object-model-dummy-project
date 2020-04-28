import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'TAB_CHANGED',
    'TAB_LOADING',
    'TAB_LOADED',
    'VIEW_CHANGED',
    'TOGGLE_GRID',
    'TOGGLE_FILTERS',
    'PANELTAB_CHANGED',
    'UPDATE_PROGRESS_BUFFER'
  ], 'kubric/campaign/creatives'),
};