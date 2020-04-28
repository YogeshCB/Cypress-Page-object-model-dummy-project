import { h } from 'preact';
import Workspaces from './workspace/index';
import workspaceOperations from "../../../../store/objects/workspace/operations";
import { connect } from 'preact-redux';

export default connect(state => {
  const workspace = state.workspace;
  return ({
    ...workspace,
  });
}, {
  ...workspaceOperations,
})(Workspaces);
