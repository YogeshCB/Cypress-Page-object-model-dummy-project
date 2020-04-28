import store from '../../../store';

const zip = state => (state || store.getState()).zip;

const getIsZipping = state => zip(state).zipping;

const getTotalDownloadInitiated = state => zip(state).totalDownloadInitiated;

const getTotalCompletedDownload = state => zip(state).totalCompletedDownload;

export default {
    getIsZipping,
    getTotalDownloadInitiated,
    getTotalCompletedDownload
};
