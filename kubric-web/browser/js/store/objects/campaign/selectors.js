import store from '../..';
import campaignStoryboardsList from './storyboards/reducer/list';
import { at } from "@bit/kubric.utils.common.lodash";

const sbSelectors = campaignStoryboardsList.selectors;

const campaign = state => (state || store.getState()).campaign;

const getCampaignName = state => campaign(state).name;

const getCampaignFeedURL = state => campaign(state).feed;

const getCampaignId = state => campaign(state).id;

const getModalStatus = state => campaign(state).modalStatus;

const isNameModalOpen = state => campaign(state).isModalOpen;

const getExportedFolder = state => campaign(state).exported_creative_folder;

const getSelectedStoryboardIds = () => sbSelectors.getSelectedIds();

const getSelectedStoryboards = () => sbSelectors.getSelectedRows();

const getConfirmationDialog = state => campaign(state).confirmationDialog;

const getCampaignVideos = state => at(campaign(state), 'videos.data');

const getAdsWithMissingAssets = state => at(campaign(state), 'missingAssetsCount')[0];

const getMediaFormat = state => campaign(state).mediaFormat;

const getTemplateId = state => campaign(state).template;

const getBindings = (index = 0, state) => campaign(state).bindings[index];

const getCampaignStatus = state => campaign(state).status;

const getTasks = state => campaign(state).tasks;

const getCurrentPage = state => campaign(state).page;

const getLinkedStoryboards = state => campaign(state).linkedStoryboards;

const getLinkedStoryboard = (index = 0, state) => campaign(state).linkedStoryboards[index];

const getShots = (index = 0, state) => at(getLinkedStoryboard(index, state), 'shots', [])[0];

export default {
  getCurrentPage,
  getBindings,
  getSelectedStoryboardIds,
  getLinkedStoryboards,
  getLinkedStoryboard,
  getSelectedStoryboards,
  getTemplateId,
  getCampaignName,
  getCampaignId,
  isNameModalOpen,
  getCampaignFeedURL,
  getExportedFolder,
  getConfirmationDialog,
  getShots,
  getAdsWithMissingAssets,
  getCampaignVideos,
  getMediaFormat,
  getCampaignStatus,
  getModalStatus,
  getTasks
};
