import Teams from './teams/index';
import teamOperations from "../../store/objects/team/operations";
import teamSelectors from "../../store/objects/team/selectors";
import { connect } from 'preact-redux';
import userSelectors from '../../store/objects/user/selectors';
import workspaceSelectors from '../../store/objects/workspace/selectors';

export default connect(state => ({
  teams: workspaceSelectors.getWorkspace(state).teams,
  profile: userSelectors.getUserEmail(state),
  loading: teamSelectors.getLoading(state),
  workspace: workspaceSelectors.getWorkspace(state),
}), {
  ...teamOperations,
})(Teams);