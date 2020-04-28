//Retrieve campaign ads that have been newly created and generate videos for them
import { campaignStatus } from "../../../isomorphic/constants/queue";
import { generateJobFor } from "./wares";
import services from "../../services";
import logger from "../../lib/logger";
import CreativeJobGenerator from "../../jobs/CreativeGenerator";
import { getResponseMessage } from "../../lib/messages";

const singleVideoJob = async (req, res) => {
  try {
    const { campaign } = req.params;
    const { token, email, userid, workspace_id: workspace } = req._sessionData;
    const { data: campaignAd } = await services.campaignAd
      .get()
      .send({
        token,
        ...req.params,
      });
    await CreativeJobGenerator.createVideoJob(campaign, {
      email,
      userid,
      token,
      workspace
    }, campaignAd);
    res.status(200).send();
  } catch (ex) {
    logger.error('/:campaignId/ad/:ad/video');
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.generateAdVideo.FAILED`));
  }
};

export default Router => {
  Router.put('/:campaignId/videos', (req, res, next) => {
    const { status = campaignStatus.CREATION_COMPLETED, qcStatus } = req.body;
    generateJobFor({
      status,
      qcStatus
    }, 'generateVideos', req, res, next);
  });

  //Retrieve campaign ads for which video generation erred and regenerate them
  Router.put('/:campaignId/videos/retry', generateJobFor.bind(null, { status: campaignStatus.GENERATION_ERRED }, 'retryVideos'));

  Router.put('/:campaignId/videos/status', (req, res, next) => {
    const adStatus = req.query.status;
    generateJobFor({ status: adStatus }, 'retryVideos', req, res, next);
  });

  Router.put('/:campaign/ad/:ad/video', singleVideoJob);

  return Router;
};