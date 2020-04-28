import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'MESSAGES_FETCHED',
    'INCOMING_MESSAGE',
    'SEND_MESSAGE',
    'CHANNEL_CONNECTING',
    'CHANNEL_CONNECTED',
    'CHANNEL_SELECTED',
    'SET_USER_COLOR'
  ], 'kubric/chat'),
};