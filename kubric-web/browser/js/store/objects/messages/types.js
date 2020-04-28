import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'MESSAGES_FETCHED',
    'MESSAGES_SETUP',
    'NOTIFICATIONS_FETCHED',
    'TOGGLE_PREFERENCES',
    'NOTIFICATION_CONFIG_FETCHED',
    'PURGE_NOTIFICATIONS',
    'NOTIFICATION_SUBSCRIPTIONS_FETCHED',
    'NOTIFICATION_PREFERENCE_CHANGE'
  ], 'kubric/messages'),
};