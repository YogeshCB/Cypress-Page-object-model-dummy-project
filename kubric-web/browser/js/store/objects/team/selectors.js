import store from '../../../store';

const team = state => (state || store.getState()).team;

const getTeams = state => (state || store.getState()).team.teams.filter(tm => tm.name !== 'private');

const getSelectedTeams = state => team(state).selected;

const getLoading = state => team(state).loading;

export default {
  getTeams,
  getLoading,
  getSelectedTeams
};