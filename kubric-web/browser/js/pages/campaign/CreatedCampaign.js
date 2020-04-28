import campaignActions from '../../store/objects/campaign/actions';
import store from '../../store';
import Creatives from './Creatives';
import campaignSelectors from '../../store/objects/campaign/selectors';
import { campaignStatus } from "../../../../isomorphic/constants/queue";
import ssActions from "../../store/objects/campaign/ssupload/actions";
import { listenToSpreadsheetJob } from "../../store/objects/campaign/listeners";

export const routeWillLoad = ({ params = {} }) => {
  const status = campaignSelectors.getCampaignStatus();
  if (status === campaignStatus.UPDATING_ADS) {
    listenToSpreadsheetJob();
    store.dispatch(ssActions.openUpload());
  }
  store.dispatch(campaignActions.pageChanged(2));
  return Creatives;
};