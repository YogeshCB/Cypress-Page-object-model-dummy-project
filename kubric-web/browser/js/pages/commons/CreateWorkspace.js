import Create from './createworkspace/index';
import workspaceOperations from "../../store/objects/workspace/operations";
import workspaceActions from "../../store/objects/workspace/actions";
import workspaceSelectors from "../../store/objects/workspace/selectors";
import userSelectors from '../../store/objects/user/selectors';
import { connect } from 'preact-redux';


export default connect(state => ({
  workspace: workspaceSelectors.getWorkspace(state),
  loading: workspaceSelectors.getLoading(state),
  owner: userSelectors.getUserEmail(state)
}), {
  ...workspaceActions,
  ...workspaceOperations
})(Create);