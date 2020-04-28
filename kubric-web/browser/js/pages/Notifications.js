import Notifications from './notifications/index';
import notificationActions from '../store/objects/notifications/actions';
import { connect } from 'preact-redux';
import DataFetcher, { getServiceHandler } from '../mixins/DataFetcher';
import services from '../services/index';
import store from '../store';

export default connect(state => ({}), {
  ...notificationActions
})(DataFetcher({
  component: Notifications,
  objects: {
    notifications: {
      service: getServiceHandler(services.notifications.get),
      onFetched(res) {
        store.dispatch(notificationActions.notificationsFetched(res));
      }
    },
  },
}));
