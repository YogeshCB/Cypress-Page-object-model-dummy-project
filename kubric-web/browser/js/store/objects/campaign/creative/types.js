import { getTypes } from "@bit/kubric.redux.reducks.utils";
import playerPack from "./player";

const prefix = 'kubric/campaign/creative';

export default {
  ...getTypes([
    'CREATIVE_FETCHED',
    'CHAT_INITIATED',
    'STORYBOARD_FETCHED',
  ], prefix),
  ...playerPack.types
};