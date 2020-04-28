import { redirect } from "@bit/kubric.utils.common.router";
import {
  getCampaignUrl
} from "../../../lib/links";
import campaignListPack from '../lists/campaigns/index';
import teamSelectors from '../team/selectors';
import campaignsActions from '../campaigns/actions';
import notificationActions  from '../notifications/actions';
import actions from './actions';
import services from '../../../services';
import { getOperations } from "@bit/kubric.redux.reducks.utils";

const onCampaignSelected = campaign => dispatch => {
  dispatch(actions.campaignSelected(campaign));
  redirect(getCampaignUrl(campaign.uid));
};

const fetchCampaigns = query => dispatch =>
  services.campaigns.get()
    .notifyStore()
    .send({
      query
    });

const confirmShare = (unshare = false) => dispatch => {
  const team_ids = teamSelectors.getSelectedTeams();
  const campaign_ids = campaignListPack.selectors.getSelectedIds();
  services.campaigns.share()
    .notifyStore()
    .send({
      op: unshare?'unshare':'share',
      campaign_ids,
      team_ids
    })
    .then(res => {
      if (res.status === 200) {
        dispatch(notificationActions.addNotification({
          type: 'success',
          heading: `Succesfully ${unshare? 'Unshared':'Shared'}!`,
        }));
      }
    })
};

export default {
  ...getOperations(campaignsActions),
  ...campaignListPack.operations,
  onCampaignSelected,
  fetchCampaigns,
  confirmShare
};
