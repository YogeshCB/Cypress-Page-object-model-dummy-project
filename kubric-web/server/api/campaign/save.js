import logger from "../../lib/logger";
import services from "../../services";
import manualQCJob from "../../jobs/ManualQC/job";
import { stringifyJson } from "../../../isomorphic/utils";
import { responseTransformer, serviceHelper } from "../utils";

const saveCampaign = (req, res) => {
  let { name, audiences, template, publishData = {}, campaignId, allAudiences, mediaFormat = "video" } = req.body;
  if (!campaignId) {
    campaignId = req.params.campaignId;
  }
  let data = {
    ...req._sessionData,
    name,
    template,
    audiences,
    publishData,
    allAudiences,
    mediaFormat
  };
  if (campaignId) {
    data.campaignId = campaignId;
  }
  serviceHelper(res, {
    resource: 'campaigns',
    service: 'save',
    data,
    transformer: responseTransformer,
  });
};

const saveCampaignAd = (req, res, next) => {
  serviceHelper(res, {
    resource: 'campaign',
    service: 'saveAd',
    data: {
      ...req._sessionData,
      campaign: req.params.campaignId,
      id: req.params.creative,
      ...req.body,
    },
  });
};

const mqcTaskFields = {
  manual_copy_qc_status: "manualCopyQC",
  manual_visual_qc_status: "manualVisualQC",
};

const pushManualQCJob = async (manualQCStatus, req, res) => {
  try {
    const { campaignId } = req.params;
    const { field = "manual_copy_qc_status" } = req.query;
    const { workspace_id: workspace, token, email } = req._sessionData;
    const { id } = await manualQCJob.add({
      campaignId,
      workspace,
      token,
      user: email,
      email,
      manualQCStatus,
      field
    }, {
      indexField: 'campaign',
      indexId: campaignId,
    });
    const { data = {} } = await services.campaign.get()
      .send({
        registerView: false,
        campaign: campaignId,
        ...req._sessionData,
      });
    let { tasks = '{}' } = data;
    const tasksJson = stringifyJson(tasks, {});
    const { data: campaignData = {} } =
      await services.campaigns.save()
        .send({
          campaignId,
          ...req._sessionData,
          tasks: {
            ...tasksJson,
            [mqcTaskFields[field]]: id
          }
        });
    res.status(200).send(campaignData);
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(ex);
  }
};

export default Router => {
  Router.post('/:campaignId', saveCampaign);
  Router.put('/:campaignId/creatives/approve', pushManualQCJob.bind(null, 'success'));
  Router.put('/:campaignId/creatives/reject', pushManualQCJob.bind(null, 'failure'));
  Router.put('/:campaignId/creative/:creative', saveCampaignAd);
  Router.post('/', saveCampaign);
  return Router;
}
