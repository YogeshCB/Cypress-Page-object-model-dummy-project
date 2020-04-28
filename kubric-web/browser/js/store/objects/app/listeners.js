import { Firebase } from '../../../lib/firebase';
import Resolver from '@bit/kubric.utils.common.json-resolver';
import config from '../../../config';
import appActions from './actions';
import store from '../../../store';
import rtManager from '../../../lib/rtmanager';
import types from './types';
import { setWorkspace } from "../servicetypes";
import userSelectors from '../user/selectors';
import routeSelectors from '../route/selectors';
import { HOME_ROUTE } from "../../../routes";
import homeOperations from '../home/operations'

const resolver = new Resolver();

const listenToNavRecents = () => {
  if (!userSelectors.isWorkspaceSet()) {
    return;
  }
  const data = {
    email: userSelectors.getUserEmail().replace(/\./g, ','),
    workspace: userSelectors.getWorkspaceId()
  };
  const campaignsPath = resolver.resolve(config.navPanel.fbPaths.campaigns, data);
  const assetsPath = resolver.resolve(config.navPanel.fbPaths.assets, data);

  const triggerAction = (action, snapshot) => {
    store.dispatch(action(snapshot.val() || []));
    store.dispatch(appActions.updateSelectedNav());
  };

  const campaignsUpdatedHandler = snapshot => {
    triggerAction(appActions.recentCampaignsUpdated, snapshot);
    homeOperations.onFetchRecentCampaigns()(store.dispatch);
  };
  const assetsUpdatedHandler = triggerAction.bind(null, appActions.recentAssetsUpdated);

  return Firebase.init()
    .then(() => {
      const firebaseApp = Firebase.getProdApp();
      firebaseApp.database().ref(campaignsPath).on('value', campaignsUpdatedHandler);
      firebaseApp.database().ref(assetsPath).on('value', assetsUpdatedHandler);
      return {
        types: [setWorkspace.INITIATED],
        handler: () => {
          firebaseApp.database().ref(campaignsPath).off('value', campaignsUpdatedHandler);
          firebaseApp.database().ref(assetsPath).off('value', assetsUpdatedHandler);
        }
      };
    });
};


rtManager.registerListener([types.APP_LOADED, setWorkspace.COMPLETED], listenToNavRecents);