import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default getTypes([
  'TEAMS_FETCHED',
  'CREATE_TEAM',
  'UPDATE_TEAM',
  'UPDATE_USERS',
  'SELECT_TEAM',
  'UNSELECT_TEAM',
  'PURGE_SELECTED_TEAMS',
  'DELETE_TEAM',
  'ADD_USER',
  'INVITATIONS_FETCHED',
  'DELETE_USER'
], 'kubric/team');