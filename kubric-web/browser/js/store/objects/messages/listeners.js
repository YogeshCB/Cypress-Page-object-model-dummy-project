import rtManager from '../../../lib/rtmanager';
import routeTypes from "../route/types";
import messageSelectors from "../messages/selectors";
import { Firebase } from "../../../lib/firebase";
import config from "../../../config";
import userSelectors from "../user/selectors";
import wsSelectors from "../workspace/selectors";
import Resolver from "@bit/kubric.utils.common.json-resolver";
import messageActions from "../../../store/objects/messages/actions";
import messagesListPack from "../../../store/objects/messages/list";
import store from "../../../store";

const resolver = new Resolver();

const listenForMessages = async action => {
  const isMessagesSetup = messageSelectors.isSetup();
  const email = userSelectors.getUserEmail();
  const workspace = wsSelectors.getCurrentWorkspaceId();
  if (!isMessagesSetup) {
    const firebaseApp = await Firebase.init();
    const messagesHandler = snapshot => {
      const val = snapshot.val();
      store.dispatch(messageActions.messagesFetched(val));
    };
    const messageRemovedHandler = snapshot => {
      const val = snapshot.val();
      store.dispatch(messagesListPack.actions.rowDeleted({
        id: val.id
      }));
    };
    const path = resolver.resolve(config.navPanel.fbPaths.notifications, {
      email: email.replace(/\./g, ","),
      workspace
    });
    const ref = firebaseApp.database().ref(path);
    ref.on('child_added', messagesHandler);
    ref.on('child_changed', messagesHandler);
    ref.on('child_removed', messageRemovedHandler);
    store.dispatch(messageActions.messagesSetup());
  }
};

rtManager.registerListener([routeTypes.ROUTE_LOADED], listenForMessages);
