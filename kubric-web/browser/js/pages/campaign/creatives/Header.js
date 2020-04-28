import { connect } from "preact-redux";
import Header from './header/index';
import creativesSelectors from '../../../store/objects/campaign/creatives/selectors';
import campaignSelectors from '../../../store/objects/campaign/selectors';
import creativesOperations from '../../../store/objects/campaign/creatives/operations';

export default connect(state => ({
  showFilters: creativesSelectors.getShowFilters(state),
  campaignName: campaignSelectors.getCampaignName(state),
  gridImage: creativesSelectors.getGridStatus(),
  modalStatus: campaignSelectors.getModalStatus()
}), creativesOperations)(Header);