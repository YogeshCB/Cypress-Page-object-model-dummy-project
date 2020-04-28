import HeaderMenu from './headermenu/index';
import { connect } from 'preact-redux';
import { redirect } from '@bit/kubric.utils.common.router';
import workspaceOperations from "../../../store/objects/workspace/operations";
import workspaceSelectors from "../../../store/objects/workspace/selectors";
import userOperations from "../../../store/objects/user/operations";
import profileOperations from "../../../store/objects/profile/operations";

export default connect(state => ({
  user: state.user,
  workspace: state.workspace,
  workspaceData: workspaceSelectors.getCurrentWorkspaceName(state),
  profile: state.profile
}), {
  ...workspaceOperations,
  ...userOperations,
  onProfileClick: profileOperations.onOpenProfile
})(HeaderMenu);
