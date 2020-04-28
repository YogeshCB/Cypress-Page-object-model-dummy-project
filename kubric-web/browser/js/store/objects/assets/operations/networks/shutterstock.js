import types from '../../types';
import networkOperations from '../../../profile/operations/networks';

const showLicenseModal = () => dispatch => {
    dispatch({
      type: types.SHOW_LICENSE_MODAL,
    });
    dispatch(networkOperations.shutterstock.getShutterstockSubscriptions());
};
  
const selectSubscription = (id) => dispatch => {
    dispatch({
      type: types.SELECTED_SUBSCRIPTION,
      payload: id
    })
};

export default {
    selectSubscription,
    showLicenseModal
}