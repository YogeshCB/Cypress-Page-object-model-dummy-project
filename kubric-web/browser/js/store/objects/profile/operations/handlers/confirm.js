import profileActions from "../../actions";
import notificationActions from '../../../notifications/actions';
import { publisherOAuthFlow } from "./utils";
import profileSelectors from "../../selectors";
import services from '../../../../../services';

export default {
  facebook(dispatch) {
    dispatch(profileActions.networkUiChange({
      network: 'facebook',
      data: {
        showPermissionsModal: false,
      },
    }));
    publisherOAuthFlow('facebook', dispatch);
  },
  cloudinary(dispatch) {
    services.assets.ingest()
      .notifyStore()
      .send({
        network: 'cloudinary',
        ...profileSelectors.getNetwork('cloudinary'),
      })
      .then(res=>{
        dispatch(notificationActions.addNotification({
          type: 'success',
          heading: 'Successfully Linked'
        }));
      })
      .catch(err=> {
        dispatch(notificationActions.addNotification({
          type: 'error',
          heading: 'Invalid Credentials'
        }));
      });
  },
};