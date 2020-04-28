import services from '../../../../../services';
import assetActions from '../../../assets/actions';
import notificationActions from '../../../notifications/actions';

const onSyncFolder = () => () => {
  services.networks.getShutterstockAccount()
    .notifyStore()
    .send({
      network: 'shutterstock',
    });
};

const licenseAsset = (asset_id, subscription_id, asset_type) => dispatch => {
  services.networks.licenseAsset()
    .notifyStore()
    .send({
      network: 'shutterstock',
      asset_id,
      subscription_id,
      asset_type,
    })
    .then((res)=>{
      if(res) {
        dispatch(notificationActions.addNotification({
          type: 'success',
          heading: 'Successfully Licensed',
          desc: 'Added to your assets',
        }));
        dispatch(assetActions.hideLicenseModal());
        window.open(res.data[0].download.url);
      }
    });
};

const getShutterstockSubscriptions = () => () => {
  services.networks.getShutterstockSubscriptions()
    .notifyStore()
    .send({
      network: 'shutterstock',
    });
};

export default {
  onSyncFolder,
  licenseAsset,
  getShutterstockSubscriptions
};