import logger from '../../../lib/logger';
import services from "../../../services";
import _ from "lodash";
import { campaignStatus } from "../../../../isomorphic/constants/queue";


export const updateProgress = progress => {
  const throttledProgress = _.throttle(progress, 3000);
  const updater = (stats, { prop = "", incrementBy = 1, avoidDone = false } = {}) => {
    let { totalCount, done } = stats;
    !avoidDone && (done += incrementBy);
    const newStats = {
      ...stats,
      done
    };
    if (prop.length > 0) {
      let [propValue] = _.at(stats, prop);
      propValue += incrementBy;
      _.set(newStats, prop, propValue);
    }
    throttledProgress(parseInt(done / totalCount * 100), newStats);
    return newStats;
  };
  updater.flush = throttledProgress.flush;
  updater.cancel = throttledProgress.cancel;
  return updater;
};

export default async (data, progress, resolve, reject) => {
  try {
    let { token, ssData = "[]", campaignId, source = '{}', workspace, preprocess = false } = data;
    source = JSON.parse(source);
    let adsPerRow = 1;
    const isStoryboardBased = source.type === 'storyboards';
    let ssRows = JSON.parse(ssData);
    if (isStoryboardBased) {
      const { data } = source;
      adsPerRow = data.length;
      if (!preprocess) {
        ssRows = ssRows.reduce((acc, row) => {
          for (let index = 0; index < adsPerRow; index++) {
            acc.push({
              ...row,
              storyboard: {
                ...data[index],
                index
              }
            });
          }
          return acc;
        }, []);
      }
    }
    const toBeCreated = ssRows.length;
    const auth = {
      token,
      workspace_id: workspace
    };
    const serviceData = {
      count: 1,
      campaign: campaignId,
      ...auth
    };
    const { totalHits: adsToDelete } = await services.campaign.getAds().send(serviceData);
    let totalCount = toBeCreated + adsToDelete;
    let progressData = {
      adsToCreate: toBeCreated,
      adsToDelete,
      done: 0,
      totalCount,
    };
    if (preprocess) {
      progressData = {
        ...progressData,
        erred: {
          validation: 0,
          preprocessing: 0
        },
        totalCount: totalCount + (2 * toBeCreated)  // To account for validation api progress and preprocess api progress
      }
    }
    await services.campaigns.save()
      .send({
        campaignId: campaignId,
        status: campaignStatus.UPDATING_ADS,
        ...auth
      });
    progress(0, progressData);
    resolve({
      ssData: JSON.stringify(ssRows)
    });
  } catch (ex) {
    logger.error(ex);
    reject(ex);
  }
}