import userSelectors from '../user/selectors';
import workspaceOperations from '../workspace/operations';
import services from '../../../services';
import teamActions from './actions';
import { redirect } from '@bit/kubric.utils.common.router';
import { getWorkspaceUrl } from '../../../lib/links';
import { debounce } from '@bit/kubric.utils.common.lodash';

const createTeam = team => (dispatch) =>
  services.team.create()
    .notifyStore()
    .send(team)
    .then(response => {
      if (response.status === 200) {
        dispatch(workspaceOperations.fetchWorkspaces());
        redirect(getWorkspaceUrl());
      }
    });

const updateUsers = data => (dispatch) =>
  services.team.updateUsers()
    .notifyStore()
    .send(data)
    .then(response => {
      if (response.status === 200) {
        dispatch(workspaceOperations.fetchWorkspaces());
      }
    });

const updateTeam = data => (dispatch) =>
  services.team.update()
    .notifyStore()
    .send(data)
    .then(response => {
      if (response.status === 200) {
        dispatch(workspaceOperations.fetchWorkspaces());
      }
    });

const onSelectTeams = (unselect = false, id, confirmShare) => dispatch => {
  if (unselect) {
    dispatch(teamActions.unselectTeam(id)) 
  }
  else {
    dispatch(teamActions.selectTeam(id));
  }
  debounce(dispatch(confirmShare(unselect)), 3500);
}

const deleteTeam = id => (dispatch) =>
  services.team.delete()
    .notifyStore()
    .send({
      id
    }).then(response => {
    if (response.status === 200) {
      dispatch(workspaceOperations.fetchWorkspaces());
    }
  });

const fetchTeams = () => () =>
  services.team.getTeamsOfUser()
    .notifyStore()
    .send({
      workspaceId: userSelectors.user().workspace_id
    });

export default {
  createTeam,
  onSelectTeams,
  updateUsers,
  deleteTeam,
  updateTeam,
  fetchTeams
};