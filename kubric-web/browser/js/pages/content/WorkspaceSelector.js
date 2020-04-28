import WorkspaceSelector from './workspaceselector/index';
import { connect } from 'preact-redux';
import workspaceOperations from "../../store/objects/workspace/operations";
import workspaceActions from "../../store/objects/workspace/actions";


export default connect(state => ({
  ...state.workspace
}), {
  ...workspaceActions,
  ...workspaceOperations
})(WorkspaceSelector);

