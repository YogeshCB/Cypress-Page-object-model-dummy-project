import campaignActions from './actions';
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import { redirect } from "@bit/kubric.utils.common.router";
import { getNewCampaignUrl } from "../../../lib/links";
import actions from './actions';
import services from '../../../services';

const onCampaignConfirm = () => dispatch => {
  dispatch(actions.hideModal());
  dispatch(actions.pageChanged(0));
  redirect(getNewCampaignUrl());
};

const generateAdVideo = (adId, campaignId, index) => dispatch =>
  services.campaign.singleAdVideo()
    .notifyStore()
    .send({
      campaignId,
      adId,
    }, {
      extraData: {
        id: adId,
        index,
      }
    });

export default {
  ...getOperations(campaignActions),
  generateAdVideo,
  onCampaignConfirm
};