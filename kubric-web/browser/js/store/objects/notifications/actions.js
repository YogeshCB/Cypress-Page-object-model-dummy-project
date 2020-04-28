import { getTimeStamp } from "../../../lib/utils";
import store from '../../../store';
import selectors from './selectors';
import types from './types';

const actions = {
  addNotification(payload = {}) {
    payload.id = getTimeStamp();
    payload.timeoutId = setTimeout(() => {
      store.dispatch(actions.deleteNotification(payload.id));
    }, payload.timeout || 3000);
    return {
      type: types.ADD_NOTIFICATION,
      payload,
    };
  },
  deleteNotification(id) {
    const notification = selectors.getNotification(id);
    clearTimeout(notification.timeoutId);
    return {
      type: types.DELETE_NOTIFICATION,
      payload: {
        id
      }
    };
  }
};

export default actions;