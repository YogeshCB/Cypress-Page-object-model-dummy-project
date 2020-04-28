import { connect } from 'preact-redux';
import Messages from './messages/index';
import messagesListPack from "../store/objects/messages/list";
import messagesSelectors from '../store/objects/messages/selectors';
import userSelectors from '../store/objects/user/selectors';
import StoreResolver from "../mixins/PropResolver";
import DataFetcher, { getServiceHandler, getFetcherHandlers }  from "../mixins/DataFetcher";
import services from '../services';
import messageActions from '../store/objects/messages/actions';
import messagesOperations from '../store/objects/messages/operations';

const StoreResolvedComponent = StoreResolver(Messages, {
  messages: messagesListPack.resolvers.getListData,
});

export default connect(state => ({
  messagesById: messagesListPack.selectors.getAllData(state),
  subscriptions: messagesSelectors.subscriptions(),
  email: userSelectors.getUserEmail(),
  notifications: messagesSelectors.getNotifications(),
  notificationConfig: messagesSelectors.getNotificationConfig(),
  isPreferenceVisible: messagesSelectors.isPreferenceVisible()
}), {
  ...messageActions,
  ...messagesOperations
})(DataFetcher({
  component: StoreResolvedComponent,
  objects: {
    subscriptions: {
      service: getServiceHandler(services.notifications.getSubscriptions),
      ...getFetcherHandlers(messageActions.notificationSubscriptionsFetched)
    },
    notificationConfig: {
      service: getServiceHandler(services.notifications.getConfig),
      ...getFetcherHandlers(messageActions.notificationConfigFetched)
    },
    notifications: {
      service: getServiceHandler(services.notifications.get),
      ...getFetcherHandlers(messageActions.notificationsFetched)
    }
  },
}));
