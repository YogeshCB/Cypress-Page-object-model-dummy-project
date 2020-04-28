import store from '../../../store';

const publisher = state => (state || store.getState()).publisher;

const showPublisher = state => publisher(state).showPublisher;

const getPublisherData = state => ({
  ...publisher(state).data,
  channels: publisher(state).channels.join(','),
});

const getAdCampaigns = state => publisher(state).adcampaigns;

const getPages = state => publisher(state).pages;

const getFormErrors = state => publisher(state).formErrors;

const getCurrentPageNumber = state => publisher(state).pageNumber;

const getIGAccounts = state => publisher(state).igAccounts;

const getAdsPixels = state => publisher(state).adsPixels;

const getApplication = state => publisher(state).applications;

const getSelections = state => publisher(state).selectionFields;

const getChannels = state => publisher(state).channels;

export default {
  getChannels,
  showPublisher,
  getPublisherData,
  getAdCampaigns,
  getPages,
  getFormErrors,
  getCurrentPageNumber,
  getIGAccounts,
  getAdsPixels,
  getApplication,
  getSelections
};