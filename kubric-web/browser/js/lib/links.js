export const getProfileUrl = () => `/profile`;

export const getWorkspaceUrl = () => `/workspace`;

export const getIndexUrl = () => '/home';

export const getNewCampaignUrl = () => '/campaign/storyboards';

export const getCampaignUrl = uid => `/campaign/${uid}`;

export const getCampaignsUrl = () => `/campaigns`;

export const getAssetsUrl = folderId => !folderId ? '/userassets' : `/userassets/${folderId}`;

export const getCampaignCreativesUrl = uid => `/campaign/${uid}`;

export const getCreativeEditUrl = (campaignId, uid) => `/campaign/${campaignId}/creative/${uid}/edit`;

export const getStudioUrl = () => typeof __kubric_config__ !== 'undefined' && __kubric_config__.studioRoot;

export const getMessagesUrl = () => '/messages';

export const getBulkEditUrl = campaignId => `/campaign/${campaignId}/creative/bulk/edit`;