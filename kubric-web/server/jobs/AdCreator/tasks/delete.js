import services from '../../../services';
import logger from '../../../lib/logger';
import { creativeIterator } from "../../utils";
import { updateProgress } from "./setup";

export default async (data, progress, resolve, reject) => {
  const progressUpdater = updateProgress(progress);
  try {
    let { token, campaignId, workspace, _progressStats: stats } = data;

    let runningStats = {
      ...stats
    };

    await creativeIterator({
      workspace,
      campaignId,
      token,
    }, ({ uid: ad } = {}) =>
      services.campaignAd.delete()
        .send({
          ad,
          campaign: campaignId,
          workspace_id: workspace,
          token
        })
        .then(() => {
          runningStats = progressUpdater(runningStats);
        })
        .catch(ex => {
        }), {
      avoidPagination: true,
      waitForBatch: true
    });
    progressUpdater.flush();
    resolve();
  } catch (ex) {
    logger.error(ex);
    progressUpdater.flush();
    reject(ex);
  }
}