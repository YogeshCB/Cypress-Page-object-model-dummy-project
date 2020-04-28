import store from '../../../index';
import { at } from "@bit/kubric.utils.common.lodash";
import listPack from './list';

const creatives = state => (state || store.getState()).campaign.creatives;

const getFormData = state => creatives(state).formData;

const shouldShowConfirmation = state => creatives(state).showConfirmation;

const getCampaignStatus = state => creatives(state).campaignStatus;

const getShowFilters = state => at(creatives(state), 'showFilters', false)[0];

const getStats = state => at(creatives(state), 'stats')[0];

const getActiveTab = state => at(creatives(state), 'activeTab')[0];

const getLoadingTabs = state => at(creatives(state), 'loadingTabs')[0];

const getTabCounts = state => at(creatives(state), 'tabcounts')[0];

const getGridStatus = state => at(creatives(state), 'grid')[0];

const getPanelTab = state => at(creatives(state), 'panelTab')[0];

const getSelectedRowsCount = state => listPack.selectors.getSelectedIds().length;

export default {
  getFormData,
  getStats,
  getActiveTab,
  getLoadingTabs,
  shouldShowConfirmation,
  getGridStatus,
  getCampaignStatus,
  getPanelTab,
  getShowFilters,
  getTabCounts,
  getSelectedRowsCount,
};