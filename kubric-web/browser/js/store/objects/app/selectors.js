import store from '../../../store';

const app = state => (state || store.getState()).app;

const getNavSelected = state => app(state).navSelected;

const getNavOptions = state => app(state).navOptions;

const getRecentCampaigns = state => app(state).recentCampaigns;

export default {
  getNavSelected,
  getNavOptions,
  getRecentCampaigns
};