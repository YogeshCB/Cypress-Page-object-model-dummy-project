import Users from './users/index';
import workspaceOperations from "../../store/objects/workspace/operations";
import workspaceActions from "../../store/objects/workspace/actions";
import workspaceSelectors from '../../store/objects/workspace/selectors';
import userSelectors from '../../store/objects/user/selectors';
import { connect } from 'preact-redux';

export default connect(state => ({
  users: workspaceSelectors.getUsers(state),
  loading: workspaceSelectors.getLoading(state),
  workspace: workspaceSelectors.getWorkspace(state),
  email: userSelectors.getUserEmail(state),
  isOwner: workspaceSelectors.isOwner(state),
  isAdmin: workspaceSelectors.isAdmin(state),
  invitations: workspaceSelectors.getInvitations(state),
}), {
  ...workspaceActions,
  ...workspaceOperations
})(Users);
