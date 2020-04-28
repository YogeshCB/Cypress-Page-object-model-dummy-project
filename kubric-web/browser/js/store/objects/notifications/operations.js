import { getOperations } from "@bit/kubric.redux.reducks.utils";
import actions from './actions';

export default {
  ...getOperations(actions, {
    onNotificationClosed: actions.deleteNotification,
  }),
};