import servicePackGenerator from '@bit/kubric.redux.packs.service';
import getUploadTypes from "./uploads/types";
import { SERVICETYPE_PREFIX, SOCKETTYPE_PREFIX } from "../constants";
import { getService } from "../../services";

const packGenerator = servicePackGenerator({
  typePrefix: SERVICETYPE_PREFIX
});

export const getServiceTypes = (serviceName, packer = packGenerator) => packer(getService(serviceName)).types;

//campaign ads
export const updateAd = getServiceTypes('ads.updateAd');
export const singleAdVideo = getServiceTypes('campaign.singleAdVideo');
export const generateAdVideos = getServiceTypes('campaign.generateAdVideos');
export const singleAdPublish = getServiceTypes('campaignpublisher.singleAdPublish');

//workspaces
export const setWorkspace = getServiceTypes('workspace.set');
export const createWorkspace = getServiceTypes('workspace.create');
export const deleteWorkspace = getServiceTypes('workspace.delete');
export const updateWorkspace = getServiceTypes('workspace.update');
export const updateWorkspaceUsers = getServiceTypes('workspace.updateUsers');
export const fetchWorkspaces = getServiceTypes('workspace.getWorkspacesOfUser');
export const fetchCurrentWorkspaceUsers = getServiceTypes('workspace.getCurrentWorkspaceUsers');

//assets
export const getFolders = getServiceTypes('assets.getFolders');
export const getFolderAssets = getServiceTypes('assets.getFolderAssets');
export const shareFolders = getServiceTypes('assets.shareFolders');
export const moveToFolder = getServiceTypes('assets.moveToFolder');
export const newFolder = getServiceTypes('assets.newFolder');
export const getAssets = getServiceTypes('assets.getAssets');
export const bulkUpdate = getServiceTypes('assets.bulkUpdate');
export const saveAsset = getServiceTypes('assets.save');
export const zipFolder = getServiceTypes('assets.download');

//sourcing
export const fetchImageBank = getServiceTypes('sourcing.getImageBank');

//teams
export const teamsFetched = getServiceTypes('team.getTeamsOfUser');
export const createTeam = getServiceTypes('team.create');
export const updateTeam = getServiceTypes('team.update');
export const deleteTeam = getServiceTypes('team.delete');

//profile
export const getPublisherAccount = getServiceTypes('publisher.getPublisherAccount');
export const unlinkPublisherNetwork = getServiceTypes('publisher.unlinkNetwork');
export const unlinkDrive = getServiceTypes('networks.unlinkDrive');
export const getProfile = getServiceTypes('user.getProfile');
export const profileUpload = getUploadTypes('profilepic', 'image');
export const ingestAssets = getServiceTypes('assets.ingest');
export const updateDriveFolders = getServiceTypes('networks.updateFolders');
export const getDriveAccount = getServiceTypes('networks.getDriveAccount');
export const getShutterstockAccount = getServiceTypes('networks.getShutterstockAccount');
export const getShutterstockSubscriptions = getServiceTypes('networks.getShutterstockSubscriptions');
export const licenseAsset = getServiceTypes('networks.licenseAsset');
export const getIntegrations = getServiceTypes('user.getIntegrations');

//attributes
export const fetchAttributes = getServiceTypes('segments.getAttributes');

//campaign
export const campaignFetched = getServiceTypes('campaigns.getCampaign');
export const saveCreative = getServiceTypes('campaign.saveCreative');
export const deleteCreative = getServiceTypes('campaign.deleteCreative');
export const resolveCreative = getServiceTypes('campaign.resolveCreative');
export const approveCopyQC = getServiceTypes('campaign.approveCopyQC');
export const rejectCopyQC = getServiceTypes('campaign.rejectCopyQC');
export const approveVisualQC = getServiceTypes('campaign.approveVisualQC');
export const rejectVisualQC = getServiceTypes('campaign.rejectVisualQC');

//campaigns
export const fetchCampaigns = getServiceTypes('campaigns.get');
export const confirmCampaignShare = getServiceTypes('campaigns.share');

//insights
export const getInsights = getServiceTypes('insights.get');

//publisher
export const getAdAccount = getServiceTypes('publisher.getAdAccount');
export const getAdCampaigns = getServiceTypes('publisher.getAdCampaigns');

//transform
export const transform = getServiceTypes('transform.transform');
export const filter = getServiceTypes('transform.filter');

export const fetchNewCampaignStoryboards = getServiceTypes('storyboards.get');
export const createCampaign = getServiceTypes('campaign.create');
export const getNewCampaignAds = getServiceTypes('campaign.getAds');

//chat service types
export const fetchChatMessages = servicePackGenerator({
  typePrefix: SOCKETTYPE_PREFIX
})('FETCH_MESSAGES').types;