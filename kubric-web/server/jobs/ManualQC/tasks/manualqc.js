import { creativeIterator } from "../../utils";
import services from '../../../services';
import logger from '../../../lib/logger';
import { statuses } from "../../../../isomorphic/constants/creatives";
import _ from 'lodash';
import { creativeTransformer } from "../../../api/campaign/save";

export default async (data, progress, resolve, reject) => {
  const { campaignId, workspace, token, manualQCStatus: manual_qc_status, field = "manual_copy_qc_status" } = data;
  try {
    const { totalHits: creativesCount } = await services.campaign.getAds()
      .send({
        status: statuses.GENERATION_COMPLETED,
        count: 1,
        campaign: campaignId,
        token,
        workspace_id: workspace
      });

    let completed = 0, erred = 0, creativesDone = {};
    const checkProgress = creative => {
      const totalDone = completed + erred;
      const progressData = {
        total: creativesCount,
        completed,
        erred
      };
      if (!_.isUndefined(creative)) {
        creativesDone[creative.uid] = creativeTransformer({
          data: creative
        });
        progressData.done = creativesDone;
      }
      progress(parseInt(totalDone / creativesCount * 100), progressData);
      if (totalDone === creativesCount) {
        resolve();
      }
    };
    checkProgress();
    creativeIterator({
      workspace,
      campaignId,
      token,
      adStatus: statuses.GENERATION_COMPLETED
    }, ({ uid: id } = {}) =>
      services.campaign.saveAd()
        .send({
          id,
          [field]: manual_qc_status,
          campaign: campaignId,
          workspace_id: workspace,
          token
        })
        .then(({ data } = {}) => {
          completed++;
          checkProgress(data);
        })
        .catch(() => {
          erred++;
          checkProgress();
        }));
  } catch (ex) {
    logger.error(ex);
    reject(ex);
  }
}