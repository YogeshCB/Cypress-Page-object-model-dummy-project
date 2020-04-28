import store from '../../../store';
import userSelectors from '../user/selectors';

const workspace = state => (state || store.getState(state)).workspace;

const isOwner = state => {
  const user = userSelectors.getUserEmail(state);
  const currentWorkspace = getWorkspace(state);
  return currentWorkspace.owner === user || false;
};

const isAdmin = state => {
  const user = userSelectors.getUserEmail(state);
  const userRoles = getWorkspace(state).users_roles;
  return (userRoles && userRoles[user][0].name === 'admin') || false
};

const getWorkspace = state => workspace(state).workspace;

const getUsers = state => getWorkspace(state).users_roles;

const getLoading = state => workspace(state).loading;

const getWorkspaces = state => workspace(state).workspaces;

const getInvitations = state => workspace(state).invitations;

const getCurrentWorkspaceUsers = state => workspace(state).users;

const getCurrentWorkspaceId = state => workspace(state).id;

const getCurrentWorkspaceName = state => {
  const workspaces = getWorkspaces(state);
  const workspaceId = getCurrentWorkspaceId(state);

  return workspaces.filter(workspace=> workspace.workspace_id === workspaceId)[0];
}


export default {
  getWorkspaces,
  getInvitations,
  isOwner,
  isAdmin,
  getCurrentWorkspaceName,
  workspace,
  getWorkspace,
  getUsers,
  getLoading,
  getCurrentWorkspaceUsers,
  getCurrentWorkspaceId
}
