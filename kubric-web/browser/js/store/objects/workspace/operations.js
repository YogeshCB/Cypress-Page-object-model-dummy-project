import actions from "./actions";
import {
  getIndexUrl,
  getWorkspaceUrl,
} from "../../../lib/links";
import {
  redirect
} from "@bit/kubric.utils.common.router";
import services from '../../../services';
import notificationActions from '../notifications/actions';
import messageActions from '../messages/actions';
import homeCampaignsListPack from '../lists/homecampaigns';
import roleActions from './roles/actions';

const setWorkspace = workspace_id =>
  dispatch => {
    services.workspace.set()
      .notifyStore()
      .send( {
        workspace_id
      } )
      .then( () => {
        dispatch( actions.hideSwitchWorkspace() );
        dispatch( homeCampaignsListPack.operations.onPurgeList() );
        dispatch( messageActions.purgeNotifications({ payload: [] }) );
        redirect( getIndexUrl() );
      } );
  };

const getWorkspace = ( workspaceId ) => dispatch => services.workspace.get()
  .notifyStore()
  .send( {
    workspaceId
  } )

const createWorkspace = workspace =>
  dispatch => {
    services.workspace.create()
      .notifyStore()
      .send( workspace )
      .then( ( res ) => {
        if ( res.status === 200 ) {
          const workspaceId = res.data.workspace_id;
          dispatch( fetchWorkspaces() )
            .then( res => res.status === 200 && dispatch( setWorkspace( workspaceId ) ) );
        }
      } )
  };

const revokeInvitation = token_id => dispatch => services.workspace.revokeInvitation().notifyStore().send( {
    token_id
  } )
  .then( ( res ) => {
    if ( res.status === 200 ) {
      dispatch( notificationActions.addNotification( {
        type: 'success',
        heading: 'Succesfully Revoked!',
      } ) );
      redirect( getWorkspaceUrl() );
    }
  } );

const deleteWorkspace = workspaceId =>
  dispatch => {
    services.workspace.delete()
      .notifyStore()
      .send( {
        workspaceId
      } )
      .then( ( res ) => {
        if ( res.status === 200 ) {
          dispatch( fetchWorkspaces() );
        }
      } )
  };

const fetchWorkspaces = () => dispatch => services.workspace.getWorkspacesOfUser().notifyStore().send();

const updateWorkspace = workspace =>
  dispatch => {
    services.workspace.update()
      .notifyStore()
      .send( workspace )
      .then( ( res ) => {
        if ( res.status === 200 ) {
          dispatch( fetchWorkspaces() );
        }
      } )
  };

const addUserToWorkspace = workspace =>
  dispatch =>
  services.workspace.updateUsers()
  .notifyStore()
  .send( workspace )
  .then( ( res ) => {
    if ( res.status === 200 ) {
      redirect( getWorkspaceUrl() );
    }
  } );

const deleteUserFromWorkspace = workspace =>
  dispatch =>
  services.workspace.updateUsers()
  .notifyStore()
  .send( workspace )
  .then( ( res ) => {
    if ( res.status === 200 ) {
      dispatch( fetchWorkspaces() );
    }
  } );

const getRoles = () => dispatch => services.roles.get()
  .notifyStore()
  .send()
  .then( res => {
    dispatch( roleActions.rolesFetched( res ) )
  } );

const getInvitations = ( workspaceId ) => dispatch => services.workspace.getInvitations()
  .notifyStore()
  .send( {
    workspaceId
  } )
  .then( res => {
    dispatch( actions.invitationsFetched( res ) )
  } );

const onManageWorkspace = () => redirect( getWorkspaceUrl() );

export default {
  setWorkspace,
  onManageWorkspace,
  getRoles,
  getInvitations,
  createWorkspace,
  getWorkspace,
  deleteWorkspace,
  revokeInvitation,
  updateWorkspace,
  addUserToWorkspace,
  fetchWorkspaces,
  deleteUserFromWorkspace
}