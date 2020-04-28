import services from '../../../services';
import logger from '../../../lib/logger';
import { creativeIterator } from "../../utils";
import { extractBindings, resolveCreative } from "../../../api/campaign/resolution";

export default async (data, progress, resolve) => {
  let { token, campaignId, adStatus, workspace_id: workspace, email } = data;
  const bindings = await extractBindings(campaignId, {
    workspace_id: workspace,
    token
  });
  const { totalHits: total } = await services.campaign.getAds()
    .send({
      workspace_id: workspace,
      token,
      campaign: campaignId,
      status: adStatus,
      count: 1,
    });
  let runningStats = {
    done: 0,
    completed: 0,
    erred: 0,
    total
  };

  if (total > 0) {
    progress(0, runningStats);

    const updateProgress = (hasErred = false) => {
      let { total, done = 0, completed = 0, erred = 0 } = runningStats;
      done++;
      hasErred ? erred++ : completed++;
      runningStats = {
        ...runningStats,
        done,
        erred,
        completed
      };
      progress(parseInt(done / total * 100), runningStats);
      done === total && resolve();
    };

    creativeIterator({
      workspace,
      campaignId,
      token,
      adStatus
    }, async (creative = {}) => {
      try {
        await resolveCreative(creative, {
          bindings,
          sessionData: {
            email,
            token,
            workspace_id: workspace
          },
          campaignId
        });
        updateProgress();
      } catch (ex) {
        logger.error(ex);
        updateProgress(true);
      }
    });
  } else {
    progress(100, runningStats);
    resolve();
  }
}