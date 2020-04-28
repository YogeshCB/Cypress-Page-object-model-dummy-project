import profileActions from "../../actions";
import services from '../../../../../services';

const uiLoading = (dispatch, network, isLoading = true) =>
  dispatch(profileActions.networkUiChange({
    network,
    data: {
      isLoading,
    },
  }));

const onUnlinked = (dispatch, res) => {
  uiLoading(dispatch, 'facebook');
  services.user.getProfile()
    .notifyStore()
    .send()
    .then(res => {
      dispatch(profileActions.currentPublisherChange(-1));
      uiLoading(dispatch, 'facebook', false);
      return res;
    })
    .catch(ex => uiLoading(dispatch, 'facebook', false));
};

export default {
  facebook(dispatch) {
    services.publisher.unlinkPublisherNetwork()
      .notifyStore()
      .send({
        channel: 'facebook',
      })
      .then(onUnlinked.bind(null, dispatch));
  },
  youtube(dispatch) {
    services.publisher.unlinkPublisherNetwork()
      .notifyStore()
      .send({
        channel: 'youtube',
      })
      .then(onUnlinked.bind(null, dispatch));
  },
  drive(dispatch) {
    services.networks.unlinkDrive()
      .notifyStore()
      .send({
        network: 'drive',
      })
      .then(onUnlinked.bind(null, dispatch));
  },
  shutterstock(dispatch) {
    services.networks.unlinkShutterstock()
      .notifyStore()
      .send({
        network: 'shutterstock',
      })
      .then(onUnlinked.bind(null, dispatch));
  },
  cloudinary(dispatch) {
    services.networks.unlinkCloudinary()
      .notifyStore()
      .send({
        network: 'cloudinary',
      })
      .then(onUnlinked.bind(null, dispatch));
  }
};
