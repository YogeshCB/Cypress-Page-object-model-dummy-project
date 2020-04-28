import spinnerTypes from './types';
import { getServiceTypes } from "../servicetypes";

const spinforRequests = [
  'ads.postAds',
  'template.save',
  'template.copy',
  'templates.get',
  'campaign.save',
  'template.remove',
  'publisher.getUrl',
  'user.updateProfile',
  'campaign.retryAdVideos',
  'campaign.rejectCreatives',
  'campaign.retryAdCreation',
  'campaign.generateAdVideos',
  'campaign.approveCreatives',
  'networks.getDriveOAuthUrl',
  'campaign.generateCampaignAds',
  'publisher.unlinkPublisherNetwork',
  'campaignpublisher.retryPublishAds',
  'campaignpublisher.publishCampaignAds'
];

let requestMap;

export default (state = {}, action) => {
  if (!requestMap) {
    requestMap = spinforRequests.reduce((acc, request) => {
      const { INITIATED: initiatedType, COMPLETED: completedType, FAILED: failedType } = getServiceTypes(request);
      acc[initiatedType] = true;
      acc[completedType] = true;
      acc[failedType] = true;
      return acc;
    }, {});
  }
  if (requestMap[action.type]) {
    const serviceStatus = action.type.split('/').pop();
    switch (serviceStatus) {
      case 'INITIATED':
        return {
          showSpinner: true,
        };
      case 'COMPLETED':
      case 'FAILED':
        return {
          showSpinner: false,
        };
      default:
        return state;
    }
  } else {
    switch (action.type) {
      case spinnerTypes.SHOW_SPINNER:
        return {
          showSpinner: true,
        };
      case spinnerTypes.HIDE_SPINNER:
        return {
          showSpinner: false,
        };
      default:
        return state;
    }
  }
};