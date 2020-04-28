import store from '../../../store';

const notifications = state => (state || store.getState()).notifications;

const getNotificationsById = state => notifications(state).byId;

const getNotification = (id, state) => {
  const notifications = getNotificationsById(state);
  return notifications[id];
};

export default {
  getState: notifications,
  getNotification,
};
