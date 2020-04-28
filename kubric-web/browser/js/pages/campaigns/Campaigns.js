import { connect } from 'preact-redux';
import Campaigns from './campaigns/index';
import campaignsOperations from "../../store/objects/campaigns/operations";
import campaignSelectors from '../../store/objects/campaigns/selectors';
import teamOperations from '../../store/objects/team/operations';
import teamSelectors from '../../store/objects/team/selectors';
import assetOperations from '../../store/objects/assets/operations';
import campaignListPack from '../../store/objects/lists/campaigns';
import StoreResolver from '../../mixins/PropResolver';
import campaignResolver from '../campaigns/campaigns/resolvers';

const campaignListSelectors = campaignListPack.selectors;

const StoreResolvedComponent = StoreResolver(Campaigns, {
  campaigns: campaignResolver.resolveCampaigns,
  selectedCampaigns: campaignResolver.resolveSelected
});

export default connect(state => ({
  campaignsById: campaignListSelectors.getAllForFilterQuery('uid'),
  campaignIds: campaignListSelectors.getCurrentFilterResults(),
  loading: campaignListSelectors.isQueryFilterLoading(),
  completed: campaignListSelectors.isQueryFilterCompleted(),
  filters: campaignListSelectors.getFilters(),
  teamsLoading: teamSelectors.getLoading(state),
  limit: campaignListSelectors.getLimit(),
  selected: campaignListSelectors.getRowStats(),
  teams: teamSelectors.getTeams(state),
  selectedTeams: teamSelectors.getSelectedTeams(state),
  showShared: campaignSelectors.getStatusForShare(state)
}), {
  ...assetOperations,
  ...campaignsOperations,
  ...campaignListPack.operations,
  ...teamOperations,
})(StoreResolvedComponent);