import logger from "../../lib/logger";
import services from "../../services";
import messages from "../../lib/messages";
import CreativeResolver from "../../jobs/CreativeResolver";
import { campaignStatus } from "../../../isomorphic/constants/queue";
import { resolveAd } from "../../jobs/AdCreator/tasks/create";
import _ from 'lodash';

export const extractBindings = async (campaign, sessionData = {}) => {
  const { data: campaignData = {} } =
    await services.campaign.get()
      .send({
        ...sessionData,
        campaign
      });
  return _.get(campaignData, 'template.bindings');
};

export const resolveCreative = async ({ uid: id, source = {} } = {}, { bindings, sessionData, campaignId } = {}) => {
  const { email, token, workspace_id: workspace } = sessionData;
  const { segment = {} } = source;
  const { meta, status, parameters } = await resolveAd({
    email,
    bindings,
    token,
    workspace,
  }, segment);

  return services.campaign.saveAd()
    .send({
      id,
      campaign: campaignId,
      workspace_id: workspace,
      token,
      meta,
      status,
      source: {
        ...source,
        parameters,
      }
    });
};

const resolveCreatives = async (adStatus, req, res) => {
  try {
    const { campaignId } = req.params;
    const jobData = await CreativeResolver.add({
      ...req._sessionData,
      campaignId,
      adStatus
    });
    await services.campaigns.save().send({
      ...req._sessionData,
      campaignId,
      tasks: {
        retryResolution: jobData.id,
      },
    });
    res.status(200).send();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.creativesResolution.FAILED'));
  }
};

const resolveSingleCreative = async (req, res) => {
  try {
    const { campaignId, creativeId } = req.params;
    const bindings = await extractBindings(campaignId, req._sessionData);
    const { data: creative } = await services.campaignAd.get()
      .send({
        ...req._sessionData,
        campaign: campaignId,
        ad: creativeId
      });
    const { data: updatedCreative } = await resolveCreative(creative, {
      bindings,
      sessionData: req._sessionData,
      campaignId
    });
    res.status(200).send(updatedCreative);
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.creativesResolution.FAILED'));
  }
};

export default Router => {
  Router.put('/:campaignId/creatives/resolve', resolveCreatives.bind(null, campaignStatus.CREATION_ERRED));
  Router.put('/:campaignId/creative/:creativeId/resolve', resolveSingleCreative);
  return Router;
};
