import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default id => getTypes([
  'PREVIEW_PLAY',
  'PREVIEW_RESTART',
  'PREVIEW_PAUSE',
  'PLAYING_SHOT_CHANGED',
], `kubric/packs/player/${id}`);