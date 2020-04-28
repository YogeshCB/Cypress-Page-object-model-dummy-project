import store from '../../../store';

const home = state => (state || store.getState()).home;

const isCampaignsLoading = state => home(state).campaignsLoading;

const isEmpty = state => home(state).isEmpty;

export default {
  isCampaignsLoading,
  isEmpty
};