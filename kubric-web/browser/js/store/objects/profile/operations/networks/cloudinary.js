import profileSelectors from "../../selectors";
import notificationActions from '../../../notifications/actions';
import services from "../../../../../services";

const onCloudinaryAddFolder = folder_prefixes => dispatch => {
  const cloudinaryCredentials = profileSelectors.getNetwork('cloudinary');
  
  services.networks.syncCloudinary()
    .notifyStore()
    .send({
        folder_prefixes,
        api_secret: cloudinaryCredentials.api_secret,
        api_key: cloudinaryCredentials.api_key,
        cloud_name: cloudinaryCredentials.cloud_name
    })
    .then(res=>{
      dispatch(notificationActions.addNotification({
        type: 'success',
        heading: res.status
      }));
    })
    .catch(err=>{
      dispatch(notificationActions.addNotification({
        type: 'error',
        heading: 'Could not sync'
      }));
    });
};

const pickerCallback = assets => dispatch => dispatch(onCloudinaryAddFolder(assets.map(asset=>`${asset.name}/`)));

export default {
  onCloudinaryAddFolder,
  pickerCallback
};