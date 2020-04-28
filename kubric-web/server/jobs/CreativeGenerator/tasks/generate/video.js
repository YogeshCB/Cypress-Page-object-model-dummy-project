import services from "../../../../services";
import logger from '../../../../lib/logger';
import { campaignStatus } from "../../../../../isomorphic/constants/queue";
import config from "config";
import Resolver from "@bit/kubric.utils.common.json-resolver";
import _ from "lodash";
import { getAdRef } from "../../../utils";
import { generationStatuses } from "../../../../../isomorphic/constants/creatives";
import firebase from 'firebase-admin';

export const sanitizeAd = ad => {
  delete ad.campn;
  delete ad.created_on;
  delete ad.status;
  delete ad.source;
  delete ad.ad;
  delete ad.uid;
  return ad;
};

const resolver = new Resolver();

const getTemplates = async (ad, auth = {}) => {
  const { source, storyboard_id: storyboard, storyboard_version: version } = ad;
  let { templates } = source;
  if (!_.isUndefined(templates)) {
    return Array.isArray(templates) ? templates : [templates];
  } else {
    return await services.storyboard
      .get()
      .send({
        ...auth,
        storyboard,
        version
      })
      .then(res => _.get(res, 'data.shots').map(({ template }) => template));
  }
};

export default async (adUpdater, data, progress, resolve, reject, { halfVideo = false, path } = {}) => {
  const { email, ad = {}, token, campaignId, workspace: workspace_id, callback } = data;
  const { source } = ad;
  const { parameters = [] } = source;
  const { mediaFormat: format = "video", uid } = ad;
  const templates = await getTemplates(ad, {
    workspace_id,
    token
  });
  let unsubscribeFn;
  const adRef = getAdRef(campaignId, uid);
  try {
    const logPath = resolver.resolve(config.get("firebase.refs.campaigns.ad"), {
      campaign: campaignId,
      ad: uid
    });
    const serviceData = {
      token,
      parameters,
      templates,
      email,
      env: process.env.NODE_ENV,
      options: {
        path,
        logs: {
          path: logPath,
          field: 'creative'
        },
        format: {
          type: format,
          halfVideo
        }
      }
    };
    if (!_.isUndefined(callback)) {
      serviceData.callback = callback;
    }
    const { video = {} } = await services.video.generate()
      .send(serviceData);
    await adUpdater(campaignStatus.GENERATION_INPROGRESS);
    progress(0, {
      creative: video
    });
    let hasCompleted = false;
    const { uid: expectedCreativeId } = video;

    unsubscribeFn = adRef.onSnapshot(async snap => {
      if (hasCompleted) {
        return false;
      }
      const creativeData = snap.data().creative;
      if (!_.isUndefined(creativeData)) {
        const { status = generationStatuses.IN_PROGRESS, creativeId: currentCreativeId, progress: creativeProgress = 0, watermarkURL: watermarkUrl, thumbnailURL: thumbnail, videoURL: url } = creativeData;
        if (currentCreativeId === expectedCreativeId) {
          progress(creativeProgress);
          if (status === generationStatuses.COMPLETED && !_.isUndefined(url)) {
            hasCompleted = true;
            const adData = sanitizeAd({
              ...ad,
              content: {
                ...ad.content,
                video: {
                  url,
                  thumbnail,
                  watermarkUrl
                },
              },
            });
            unsubscribeFn();
            let updatedAd;
            try {
              updatedAd = await adUpdater(campaignStatus.GENERATION_COMPLETED, adData);
            } catch (ex) {
              logger.error(ex);
            }
            resolve({
              ad: _.isUndefined(updatedAd) ? {} : updatedAd.data,
              progress: 30,
              video: url || '',
            });
          } else if (status === generationStatuses.FAILED) {
            hasCompleted = true;
            unsubscribeFn();
            try {
              await adUpdater(campaignStatus.GENERATION_ERRED);
            } catch (ex) {
              logger.error(ex);
            }
            reject();
          }
        }
      }
    });
  } catch (ex) {
    logger.error(ex);
    _.isFunction(unsubscribeFn) && unsubscribeFn();
    reject(ex);
    try {
      await adUpdater(campaignStatus.GENERATION_ERRED);
    } catch (ex) {
      logger.error(ex);
    }
  }
};