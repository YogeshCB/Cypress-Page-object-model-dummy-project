import profileActions from "../../actions";
import profileSelectors from "../../selectors";
import config from '../../../../../config';
import { publisherOAuthFlow } from "./utils";
import services from '../../../../../services';

//Returns false if not linked and does stuff required to initiated linking
export default {
  facebook(dispatch) {
    const isConnected = !!profileSelectors.getNetwork('facebook');
    if (!isConnected) {
      dispatch(profileActions.networkUiChange({
        network: 'facebook',
        data: {
          showPermissionsModal: true,
        },
      }));
      return false;
    } else {
      return true;
    }
  },
  youtube(dispatch) {
    const isConnected = !!profileSelectors.getNetwork('youtube');
    if (!isConnected) {
      publisherOAuthFlow('youtube', dispatch);
      return false;
    } else {
      return true;
    }
  },
  drive(dispatch) {
    const isConnected = !!profileSelectors.getNetwork('drive');
    if (!isConnected) {
      services.networks.getDriveOAuthUrl()
        .notifyStore()
        .send({
          redirect: config.assets.networks.oauthRedirect.drive,
        })
        .then(res => {
          location.href = res;
        });
      return false;
    } else {
      return true;
    }
  },
  shutterstock(dispatch) {
    const isConnected = !!profileSelectors.getNetwork('shutterstock');
    if (!isConnected) {
      services.networks.getShutterstockOAuthUrl()
        .notifyStore()
        .send({
          redirect: config.assets.networks.oauthRedirect.shutterstock,
        })
        .then(res => {
          location.href = res;
        });
      return false;
    } else {
      return true;
    }
  }
};