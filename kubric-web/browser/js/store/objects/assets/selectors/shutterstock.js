import store from '../../../../store';

const assets = state => (state || store.getState()).assets;

const getLicenseModalStatus = state => assets(state).subscription.status;

const getSelectedSubscription = state => assets(state).subscription.subscription_id;

const getSubscriptions = state => assets(state).subscription.subscriptions;

const getLoadingSubscription = state => assets(state).subscription.loading;

const getLicensedData = state => assets(state).subscription.imageData;

export default {
    getLicenseModalStatus,
    getLoadingSubscription,
    getSelectedSubscription,
    getSubscriptions,
    getLicensedData
}