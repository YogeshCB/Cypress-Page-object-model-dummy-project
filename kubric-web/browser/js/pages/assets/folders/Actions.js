import { h } from 'preact';
import teamSelectors from '../../../store/objects/team/selectors';
import assetOperations from '../../../store/objects/assets/operations';
import teamOperations from '../../../store/objects/team/operations';
import { connect } from 'preact-redux';
import FolderActions from './actions/index';

export default connect(
  state => ({
    teams: teamSelectors.getTeams(),
    selectedTeams: teamSelectors.getSelectedTeams(),
    teamsLoading: teamSelectors.getLoading(state),
  }), {
    ...assetOperations,
    ...teamOperations,
  }
)(FolderActions);
