import store from '../../../../store';

const assets = state => (state || store.getState()).assets;

const getFiles = state => assets(state).modal.data.files;

const getAttributes = state => assets(state).modal.data.attributes;

const getTags = state => assets(state).modal.data.tags;

const getModalStatus = state => assets(state).modal.status;

const getDataToUpload = state => assets(state).modal.data;

const getFailedDataToUpload = state => assets(state).modal.data;

const getSavedData = state => assets(state).modal.backup;

const isVariant = state => assets(state).variantUpload;

const getUploadModalStatus = state => assets(state).uploadModal;

export default {
    getFiles,
    getUploadModalStatus,
    getAttributes,
    getTags,
    getModalStatus,
    getDataToUpload,
    getFailedDataToUpload,
    getSavedData,
    isVariant
}