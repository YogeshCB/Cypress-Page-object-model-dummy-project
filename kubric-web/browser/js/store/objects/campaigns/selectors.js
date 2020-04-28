import store from '../../../store';

const campaigns = state => (state || store.getState()).campaigns.data;

const getCount = state => campaigns(state).allIds.length;

const getStatusForShare = state => (state || store.getState()).campaigns.showShared;

const getLoading = state => (state || store.getState()).campaigns.loading;

const getCampaign = (id, state) => campaigns(state).byId[id];

export default {
  getCount,
  campaigns,
  getCampaign,
  getLoading,
  getStatusForShare
};
