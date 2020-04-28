import store from '../../../store';

const user = state => (state || store.getState()).user;

const getUserEmail = state => user(state).email;

const getUserId = state => user(state).userid;

const getWorkspaceId = state => user(state).workspace_id;

const isWorkspaceSet = state => {
  const ws = getWorkspaceId(state);
  return ws !== '' && ws !== undefined;
};

export default {
  getUserEmail,
  getUserId,
  getWorkspaceId,
  user,
  isWorkspaceSet
};