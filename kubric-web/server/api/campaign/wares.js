import logger from "../../lib/logger";
import CreativeJobGenerator from "../../jobs/CreativeGenerator";
import messages from "../../lib/messages";

export const generateJobFor = async ({ status, qcStatus }, serviceName, req, res, next) => {
  try {
    const { campaignId } = req.params;
    const { token, email, workspace_id: workspace } = req._sessionData;
    const adGenerator = new CreativeJobGenerator({
      campaignId,
      email,
      token,
      workspace,
      adStatus: status,
      qcStatus,
    });
    adGenerator.generate();
    res.status(200).send();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.${serviceName}.FAILED`));
  }
};
