import profileSelectors from "../../selectors";
import services from '../../../../../services';

export default {
  facebook(dispatch) {
    const uiData = profileSelectors.getUIDataFor('facebook');
    if (!uiData.isCompleted) {
      services.publisher.getPublisherAccount()
        .notifyStore()
        .send({
          network: 'facebook',
        });
    }
  },
  drive(dispatch) {
    const uiData = profileSelectors.getUIDataFor('drive');
    if (!uiData.isCompleted) {
      services.networks.getDriveAccount()
        .notifyStore()
        .send({
          network: 'drive',
        });
    }
  }
};