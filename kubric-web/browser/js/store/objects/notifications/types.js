import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default getTypes([
  'ADD_NOTIFICATION',
  'DELETE_NOTIFICATION',
  'NOTIFICATIONS_FETCHED',
  'NOTIFICATION_SUBSCRIPTIONS_FETCHED',
  'NOTIFICATION_CONFIG_FETCHED',
], 'kubric/notifications');