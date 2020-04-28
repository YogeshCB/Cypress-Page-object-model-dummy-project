import _ from 'lodash';
import videoGenerator from './video';
import logger from '../../../../lib/logger';
import services from '../../../../services';
import { getStringHash } from "@bit/kubric.utils.common.lodash";
import { campaignStatus } from "../../../../../isomorphic/constants/queue";

const updateAdStatus = (campaign, id, token, workspace, status, adData) => {
  const serviceData = {
    campaign,
    id,
    token,
    status,
    workspace_id: workspace
  };
  if (!_.isUndefined(adData)) {
    serviceData.adData = adData;
  }
  return services.campaign.saveAd().send(serviceData);
};

export default async (data, progress, resolve, reject) => {
  const { ad = {}, token, campaignId, workspace } = data;
  const { source = {}, storyboard_id: storyboard } = ad;
  const { templates = [], segment = {} } = source;
  const { display_name: displayName, name = '' } = segment;
  const { uid, mediaFormat: outputFormat } = ad;
  const adUpdater = updateAdStatus.bind(null, campaignId, uid, token, workspace);
  const videoOptions = {
    path: `${getStringHash(workspace)}/${getStringHash(campaignId)}/${encodeURI((displayName || name).toLowerCase().replace(/\s/g, '_'))}`,
  };
  try {
    if (templates.length === 0 && _.isUndefined(storyboard)) {
      resolve({
        message: 'No source found to generate. Both "source.templates" and "storyboard_id" are empty',
      });
      await adUpdater(campaignStatus.GENERATION_ERRED);
    } else if (outputFormat === 'image') {
      videoGenerator(adUpdater, data, progress, resolve, reject, videoOptions)
    } else if (outputFormat === 'half-video') {
      videoGenerator(adUpdater, data, progress, resolve, reject, {
        ...videoOptions,
        halfVideo: true
      });
    } else {
      videoGenerator(adUpdater, data, progress, resolve, reject, videoOptions);
    }
  } catch (ex) {
    logger.error(ex);
    await adUpdater(campaignStatus.GENERATION_ERRED);
    reject(ex);
  }
};