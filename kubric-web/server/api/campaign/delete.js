import { serviceHelper } from "../utils";

const deleteCampaignAd = (req, res) => {
  serviceHelper(res, {
    resource: 'campaignAd',
    service: 'delete',
    data: {
      ...req._sessionData,
      ...req.params,
    },
  });
};

export default Router => {
  Router.delete('/:campaign/creative/:ad', deleteCampaignAd);
  return Router;
}
