import Manage from './workspace/index';
import workspaceOperations from "../store/objects/workspace/operations";
import workspaceSelectors from "../store/objects/workspace/selectors";
import roleSelectors from "../store/objects/workspace/roles/selectors";
import workspaceActions from "../store/objects/workspace/actions";
import userSelectors from '../store/objects/user/selectors';
import { connect } from 'preact-redux';
import store from "../store";


const ConnectedComponent = connect(state => ({
  workspace: workspaceSelectors.getWorkspace(),
  loading: workspaceSelectors.getLoading(),
  isOwner: workspaceSelectors.isOwner(),
  roles: roleSelectors.roles()
}), {
  ...workspaceActions,
  ...workspaceOperations
})(Manage);

export const routeWillLoad = () => {
  const workspaceId = userSelectors.getWorkspaceId();
  store.dispatch(workspaceActions.purgeWorkspaceDetails());
  
  return store.dispatch(workspaceOperations.getWorkspace(workspaceId))
  .then( res => {
    store.dispatch( workspaceActions.workspaceFetched( res ) )
    store.dispatch(workspaceOperations.getInvitations(workspaceId));
    store.dispatch(workspaceOperations.getRoles());
    return {
      component: ConnectedComponent
    }
  })


}
