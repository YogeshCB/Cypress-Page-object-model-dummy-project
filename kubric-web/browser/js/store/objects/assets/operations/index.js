import types from '../types';
import assetActions from "../actions";
import services from '../../../../services';
import assetSelectors from '../selectors';
import teamSelectors from '../../team/selectors';
import assetListPack from '../../lists/assets';
import {
  getAssetsUrl
} from "../../../../lib/links";
import assetTaskSelectors from '../../assettasks/selectors';
import notificationActions from '../../notifications/actions';
import {
  redirect
} from "@bit/kubric.utils.common.router";
import assettasksOperations from '../../assettasks/operations';
import assettasksActions from '../../assettasks/actions';
import networkOperations from '../../profile/operations/networks';
import {
  getOperations
} from "@bit/kubric.redux.reducks.utils";
import folderListPack from '../../lists/assets/folders';
import {
  isUndefined
} from '@bit/kubric.utils.common.lodash';
import {
  shutterstock as shutterstockOperations
} from './networks';
import {
  getFileKey
} from '../../../../lib/utils';

const onHide = () => dispatch => dispatch( assetActions.hideAssets() );

const onFileSelected = ( {
  files
}, fromDrop = false ) => dispatch => {
  dispatch( {
    type: types.SHOW_MODAL,
    payload: {
      files,
      fromDrop
    }
  } );
  const variant = assetSelectors.isVariant();
  dispatch( assetActions.uploadModal() );
  if ( variant ) {
    dispatch( onVariantUpload() );
  } else {
    dispatch( onUpload() );
  }
};

const onRetryUpload = ( key, files ) => dispatch => {
  dispatch( assetListPack.actions.rowDeleted( {
    id: key
  } ) )
  dispatch( assettasksActions.deleteAssetTask( {
    id: key
  } ) );
  dispatch( onFileSelected( files ) )
}

const onRetryTask = ( key ) => dispatch => {
  const file = assetSelectors.getAsset( key ).file;
  dispatch( onRetryUpload( key, {
    files: [ file ]
  } ) );
}

const hideModal = () => dispatch => dispatch( {
  type: types.HIDE_MODAL,
} );

const showLicenseModal = () => dispatch => {
  dispatch( {
    type: types.SHOW_LICENSE_MODAL,
  } );
  dispatch( networkOperations.shutterstock.getShutterstockSubscriptions() );
};

const selectSubscription = ( id ) => dispatch => {
  dispatch( {
    type: types.SELECTED_SUBSCRIPTION,
    payload: id
  } )
};

const onTagAdded = ( tag ) => dispatch => dispatch( {
  type: types.TAG_ADDED,
  payload: tag
} );

const onTagDeleted = ( tag ) => dispatch => dispatch( {
  type: types.TAG_DELETED,
  payload: tag
} );

const onAttributeAdded = ( id, index, field, value = '' ) => dispatch => dispatch( {
  type: types.CHANGED_ATTRIBUTE,
  payload: {
    id,
    index,
    data: {
      [ field ]: value
    }
  }
} );

const purgePath = () => dispatch =>
  dispatch( {
    type: types.FOLDER_CLICKED,
    payload: {
      path: `/root`,
      names: [ "Home" ],
      navPath: '/root'
    }
  } );

const onAttributeDeleted = ( id, index ) => dispatch => dispatch( {
  type: types.DELETED_ATTRIBUTE,
  payload: {
    id,
    index
  }
} );

const onAttributeChange = ( id, index, field, value = '' ) =>
  dispatch =>
  dispatch( assetActions.attributeChanged( {
    id,
    index,
    data: {
      [ field ]: value,
    }
  } ) );

const onAttributeDelete = ( id, index ) =>
  dispatch =>
  dispatch( assetActions.attributeDeleted( {
    id,
    index
  } ) );

const onSave = id => dispatch => {
  let asset = assetListPack.selectors.getById( id );
  if ( typeof asset === 'undefined' ) {
    asset = folderListPack.selectors.getById( id );
  }
  services.assets.save()
    .notifyStore()
    .send( asset )
    .then( res => {
      if ( res ) {
        dispatch( notificationActions.addNotification( {
          type: 'success',
          heading: 'Successfully Updated!',
        } ) );
        dispatch( folderListPack.operations.onClearRowSelections() );
      }
    } );
}

const onDelete = () => dispatch => {

  const ids = assetListPack.selectors.getSelectedIds();
  const folder_ids = folderListPack.selectors.getSelectedIds();
  dispatch( assetActions.hideDeleteModal() );

  if ( ids.length > 0 ) {
    services.assets
      .delete()
      .send( ids )
      .then( response => {
        if ( response.status === 'success' ) {
          dispatch( assetListPack.actions.rowDeleted( {
            id: ids
          } ) );
          dispatch( notificationActions.addNotification( {
            type: 'success',
            heading: 'Succesfully Deleted!',
          } ) );
        }
      } );
  } else if ( folder_ids.length === 1 ) {
    services.assets.deleteFolder()
      .notifyStore()
      .send( {
        id: folder_ids[ 0 ]
      } )
      .then( ( res ) => {
        if ( res.status === 'success' ) {
          dispatch( folderListPack.actions.rowDeleted( {
            id: folder_ids[ 0 ]
          } ) );
          onDeleteMoveHandler( dispatch, "Deleted", res );
        } else {
          dispatch( notificationActions.addNotification( {
            type: 'error',
            heading: `Failed to Delete`,
          } ) );
        }
      } )
  }
};

const onVariantUpload = () => dispatch => {
  const {
    fromDrop,
    ...dataToUpload
  } = assetSelectors.getDataToUpload();

  const {
    files
  } = dataToUpload;

  dispatch( assetActions.variantUpload( {
    title: files.name,
    file: files,
  } ) );
  dispatch( assetActions.saveLastData( {
    files
  } ) );
  dispatch( hideModal() );
}

const onUpload = folderPath => dispatch => {
  const {
    fromDrop,
    ...dataToUpload
  } = assetSelectors.getDataToUpload();
  const path = folderPath ? folderPath : assetSelectors.getNavPath();
  const {
    files,
    tags,
    attributes
  } = dataToUpload;
  dispatch( assetActions[ fromDrop ? 'dropUpload' : 'fileUpload' ]( {
    title: "Assets upload",
    files,
    path,
    tags,
    attributes
  } ) );
  dispatch( assetActions.saveLastData( {
    files,
    tags,
    attributes
  } ) );
  dispatch( hideModal() );
};

const profilePicUpload = ({files}) => dispatch => {
  dispatch(assetActions.profilePicUpload({file:files, title: 'Profile Pic'}));
};

const onExactPathChange = () => dispatch => {
  dispatch( setExactPath() );
}

const onPathClicked = id => dispatch => {
  if ( id === 'root' ) {
    window.open( getAssetsUrl(), '_blank' );
  } else {
    window.open( getAssetsUrl( id ), '_blank' );
  }
}

const onFolderClicked = id => dispatch => {
  const filters = assetListPack.selectors.getFilters();
  const isSortBySelected = filters.selected.filter( flt => flt.id === 'created_time' );

  const ids = assetListPack.selectors.getSelectedIds();
  dispatch( folderListPack.actions.queryChange( id ) );

  if ( id === 'root' ) {
    dispatch( purgePath() );
    redirect( getAssetsUrl() );
  } else {
    if ( filters.selected.length - 1 === isSortBySelected.length && filters.selected[ 0 ].id === 'private' && filters.selected[ 0 ].data.value === 'true' ) {
      redirect( getAssetsUrl( id ) );
    } else {
      const folder = assetListPack.selectors.getById( id );
      if ( ids.length === 1 ) {
        const asst = assetListPack.selectors.getById( ids[ 0 ] );
        dispatch( assetListPack.operations.onRowUnselected( asst ) );
      }
      dispatch( assetListPack.operations.onRowSelected( folder ) );
      const folderPath = folder.path;
      const folderNames = folder.path_names;
      dispatch( assetActions.showPath( {
        folderPath,
        folderNames
      } ) );
      window.open( `${getAssetsUrl(id)}`, '_blank' );
    }
  }
};

const navigateFullScreen = ( action, id ) => dispatch => {
  const filterResults = assetListPack.selectors.getCurrentFilterResults();
  if ( id ) {
    const index = filterResults.indexOf( id );
    dispatch( assetListPack.operations.onRowUnselected( {
      id
    } ) );

    if ( action === 'prev' ) {
      dispatch( assetListPack.operations.onRowSelected( {
        id: filterResults[ index - 1 ]
      } ) );
    } else if ( action === 'next' ) {
      dispatch( assetListPack.operations.onRowSelected( {
        id: filterResults[ index + 1 ]
      } ) );
    }
  }
}

const selectTeams = ( id ) => dispatch => {
  const selectedTeams = teamSelectors.getSelectedTeams();
  if ( selectedTeams.indexOf( id ) === -1 ) {
    dispatch( {
      type: types.SELECT_TEAM,
      payload: id
    } )
  } else {
    dispatch( {
      type: types.UNSELECT_TEAM,
      payload: id
    } )
  }
};

const onSharedHandler = ( dispatch, response, message ) => {
  if ( response.status === 'success' ) {
    dispatch( notificationActions.addNotification( {
      type: 'success',
      heading: message,
    } ) );
  }
};

const confirmShare = (unshare = false) => dispatch => {
  const asset_ids = assetListPack.selectors.getSelectedIds();
  const team_ids = teamSelectors.getSelectedTeams();
  const folder_ids = folderListPack.selectors.getSelectedIds();
  let folders = [],
    assets = [];

  if ( folder_ids.length > 0 ) {
    folders = folder_ids.map( folder => folderListPack.selectors.getById( folder ) );
    services.assets.shareFolders()
      .notifyStore()
      .send( {
        op: unshare? "unshare":"share",
        folder_ids,
        team_ids
      } )
      .then( ( res ) => {
        folders.map( folder => {
          dispatch( folderListPack.actions.replaceRow( {
            old: folder.id,
            new: {
              ...folder,
              shared_with: unshare? folder.shared_with.filter( team => team_ids.indexOf( team ) < 0 ): [ ...folder.shared_with, ...team_ids ]
            }
          } ) )
        } )
        onSharedHandler( dispatch, res, `Successfully ${unshare?'Unshared':'Shared'}` );
      } )
  }
  if ( asset_ids.length > 0 ) {
    assets = asset_ids.map( asset => assetListPack.selectors.getById( asset ) );
    services.assets.shareAssets()
      .notifyStore()
      .send( {
        op: unshare? "unshare":"share",
        asset_ids,
        team_ids
      } )
      .then( ( res ) => {
        assets.map( asset => {
          asset = {
            ...asset,
            shared_with: asset.shared_with ? asset.shared_with : []
          }
          dispatch( assetListPack.actions.replaceRow( {
            old: asset.id,
            new: {
              ...asset,
              shared_with: unshare ?asset.shared_with.filter( team => team_ids.indexOf( team ) < 0 ):[ ...asset.shared_with, ...team_ids ]
            }
          } ) )
        } )
        onSharedHandler( dispatch, res,  `Successfully ${unshare?'Unshared':'Shared'}`  )
      } )
  }
};

const onCreateFolder = () => dispatch => dispatch( {
  type: types.OPEN_RENAME,
  payload: {
    id: undefined
  }
} );


const onCloseFolder = () => dispatch => dispatch( {
  type: types.CLOSE_RENAME,
  payload: {}
} );


const onFolderChange = ( payload ) => dispatch => {
  dispatch( {
    type: types.CHANGE_FOLDER_DETAILS,
    payload
  } );
};

const unselectAll = () => dispatch => {
  const ids = assetListPack.selectors.getSelectedIds();
  ids.map( ( id ) => {
    const asset = assetListPack.selectors.getById( id );
    dispatch( assetListPack.operations.onRowUnselected( asset ) )
  } )
};

const selectAll = () => dispatch => {
  const ids = assetListPack.selectors.getCurrentFilterResults();
  ids.map( ( id ) => {
    const asset = assetListPack.selectors.getById( id );
    dispatch( assetListPack.operations.onRowSelected( asset ) )
  } )
};

const unselectAllFolders = () => dispatch => {
  const ids = folderListPack.selectors.getSelectedIds();
  ids.map( ( id ) => {
    const asset = folderListPack.selectors.getById( id );
    dispatch( folderListPack.operations.onRowUnselected( asset ) )
  } )
};

const selectAllFolders = () => dispatch => {
  const ids = folderListPack.selectors.getCurrentFilterResults();
  ids.map( ( id ) => {
    const asset = folderListPack.selectors.getById( id );
    dispatch( folderListPack.operations.onRowSelected( asset ) )
  } )
};

const getFolders = () => dispatch => services.assets.getFolders().notifyStore().send();

const onDeleteMoveHandler = ( dispatch, message, response ) => {
  if ( response.status === 'success' ) {

    dispatch( notificationActions.addNotification( {
      type: 'success',
      heading: `Succesfully ${message}!`,
    } ) );
  }
};

const moveAll = ( path ) => dispatch => {
  let ids = [];
  const asset_ids = assetListPack.selectors.getSelectedIds();
  const folder_ids = folderListPack.selectors.getSelectedIds();
  ids = [ ...asset_ids, ...folder_ids ];
  const assets = [];
  ids.map( ( id ) => {
    const asset = assetListPack.selectors.getById( id );
    if ( typeof asset === 'undefined' ) {
      const folder = folderListPack.selectors.getById( id );
      assets.push( folder );
    } else {
      assets.push( asset )
    }
  } );
  const old_path = assetSelectors.getNavPath();
  services.assets.moveToFolder()
    .notifyStore()
    .send( {
      assets,
      old_path,
      path
    } )
    .then( res => {
      dispatch( assetListPack.actions.rowDeleted( {
        id: asset_ids
      } ) );
      dispatch( folderListPack.actions.rowDeleted( {
        id: folder_ids
      } ) );
      onDeleteMoveHandler( dispatch, "Moved", res );
    } )
};

const triggerDownload = task_id => {

  const tasks = assetTaskSelectors.assettasks();
  const task = Object.keys( tasks ).filter( task => {
    if ( tasks[ task ].uid === task_id ) {
      return task
    }
  } )
  if ( task && task[ 0 ] && task[ 0 ].message === 'Zipping folder completed' ) {
    window.open( task.result, '_blank' );
  } else {
    setTimeout( () => {
      triggerDownload( task_id );
    }, 500 );
  }
};

const performAction = ( action, id ) => dispatch => {
  let asset = assetListPack.selectors.getById( id );
  if ( typeof asset === 'undefined' ) {
    asset = folderListPack.selectors.getById( id );
  }
  if ( action === 'rename' ) {
    dispatch( assetActions.folderUpdate() );
    dispatch( folderListPack.operations.onClearRowSelections() );
    dispatch( folderListPack.operations.onRowSelected( {
      id
    } ) );
    dispatch( assetActions.openRename( {
      id
    } ) )
  } else if ( action === 'select' ) {
    dispatch( folderListPack.operations.onRowSelected( {
      id
    } ) );
    dispatch( assetActions.showFolderDetails() );
  } else if ( action === 'delete' ) {
    dispatch( assetActions.showDeleteModal() );
    dispatch( folderListPack.operations.onClearRowSelections() );
    dispatch( folderListPack.operations.onRowSelected( {
      id
    } ) );
  } else if ( action === 'deleteArchive' ) {
    dispatch( assetActions.showDeleteModal() );
  } else if ( action === 'download' ) {
    services.assets.download()
      .notifyStore()
      .send( {
        id
      } )
      .then( ( res ) => {
        dispatch( assetActions.showTasks() )
        dispatch( triggerDownload( res.task_id ) );
      } );
  } else if ( action === 'unzip' ) {
    services.assets.unzip()
      .notifyStore()
      .send( {
        id
      } )
      .then( () => dispatch( assetActions.showTasks() ) );
  }
};

const confirmBulkTag = ( {
  ids,
  tags
} ) => dispatch => {
  const assets = [];
  ids.map( id => {
    const asset = assetListPack.selectors.getById( id );
    assets.push( {
      owner: asset.owner,
      id
    } )
  } );
  services.assets.bulkUpdate()
    .notifyStore()
    .send( {
      assets_info: assets,
      tags
    } )
    .then( res => {
      if ( res.status === 'success' ) {
        dispatch( notificationActions.addNotification( {
          type: 'success',
          heading: 'Succesfully Updated!'
        } ) );
        dispatch( assetActions.tagAssets() );
      }
    } )

}

const onConfirmFolder = () => dispatch => {
  const path = assetSelectors.getNavPath();
  const parent = assetSelectors.getAssetPath();
  const folder = assetSelectors.getFolderData();

  const folderTempKey = getFileKey( {
    file: folder
  }, path );

  const data = {
    "name": folder.name,
    path,
    "description": folder.description,
    "asset_type": "folder",
    "url": "None",
    folderId: parent === '/root' ? '' : parent
  }

  services.assets.newFolder()
    .notifyStore()
    .send( {
      ...data
    }, {
      extraData: {
        path,
        asset_type: "folder",
        url: "None",
        id: folderTempKey
      }
    } )
    .then( ( response ) => {
      dispatch( onCloseFolder() );
      dispatch( folderListPack.actions.replaceRow( {
        old: folderTempKey,
        new: {
          ...response,
          asset_type: 'active_folder',
          selectable: false,
          hoverable: false,
        }
      } ) );
    } )
};

const onFilterSelected = (value) => dispatch => {
  const firstFilterSelected = assetSelectors.getFirstFilterSelected();
  if(value.id === 'type' && value.data.value === 'folder') {
    dispatch(assetActions.folderFilterSelected());
  }
  if (!firstFilterSelected) {
    dispatch(assetActions.disallowExactPath());
    dispatch(assetActions.selectFirstFilter());
  }
  
  dispatch(assetListPack.operations.onFilterSelected(value));
}

const saveVariant = ( assetId, name, url ) => dispatch => {
  const blobname = url.substr( 'https://storage.googleapis.com/accio-assets'.length + 1, url.length );
  const assetVariant = assetSelectors.getAsset( assetId );
  services.assets.saveVariant()
    .notifyStore()
    .send( {
      op: 'create_version',
      id: assetId,
      versions: [ {
        url,
        name,
        make_default: false,
        blobname,
      } ]
    } )
    .then( res => {
      dispatch( assetListPack.actions.replaceRow( {
        old: assetId,
        new: {
          ...assetVariant,
          versions: assetVariant.versions?[
            res.version,
            ...assetVariant.versions,
          ]:[res.version]
        }
      } ) );
      dispatch( assetListPack.operations.onRowSelected( {
        id: assetId
      } ) ); 
      dispatch( notificationActions.addNotification( {
        type: 'success',
        heading: 'Succesfully Saved!'
      } ) );
      dispatch( assetActions.setForm( 'version' ) );
    } )
}

const onConfirmTransform = ( assetId, name ) => ( dispatch ) => {
  const payload = assetSelectors.getTransformData();
  const {
    x0,
    x1,
    y0,
    y1,
    resize
  } = payload;
  const crop = x0 === 0 && x1 === 0 && y1 === 0 && y0 === 0;
  const rotateBy = payload.rotateBy === 0;

  if ( assetSelectors.getTransformFormState() !== 'filter' ) {
    services.transform.transform()
      .notifyStore()
      .send( {
        assetId,
        transformations: `${resize? `resize:w=${parseInt(resize.w)};h=${parseInt(resize.h)}${resize.as!==''?`;as=${resize.as},`:''}`:''}${!rotateBy ? `rotate:a=${Number(payload.rotateBy)},` : ''}${!crop ? `crop:x0=${Number(x0)};y0=${Number(y0)};x1=${Number(x1)};y1=${Number(y1)},` : ''}`.replace( /\,$/, '' ),
      } )
      .then( res => {
        if ( res ) {
          dispatch( notificationActions.addNotification( {
            type: 'success',
            heading: 'Succesfully Transformed!'
          } ) );
        }
        dispatch( saveVariant( assetId, name, res.url ) );
      } )
  } else {
    const filteredURL = assetSelectors.getTransformUrls();

    dispatch( saveVariant( assetId, name, filteredURL[ assetId ] ) );
  }
};

const onConfirmFilter = ( assetId, filter ) => ( dispatch ) => {
  services.transform.filter()
    .notifyStore()
    .send( {
      assetId,
      filter: `filter:n=${filter}`
    } )
    .then( res => {
      if ( res ) {
        dispatch( notificationActions.addNotification( {
          type: 'success',
          heading: 'Succesfully Transformed!'
        } ) );
      }
    } )
};

const setActiveAsset = ( assetId, url, variantId ) => dispatch => {
  const assetVariant = assetSelectors.getAsset( assetId );
  services.assets.save().notifyStore().send( {
      url,
      id: assetId,
      path: assetVariant.path,
      active_version: variantId
    } )
    .then( res => {
      if ( res ) {
        dispatch( notificationActions.addNotification( {
          type: 'success',
          heading: 'Changed Default Asset'
        } ) )
        dispatch( assetListPack.actions.replaceRow( {
          old: assetId,
          new: {
            ...assetVariant,
            ...res
          }
        } ) )
      }
    } )
}
const setActiveVariant = ( assetId, url ) => dispatch => {
  const assetVariant = assetSelectors.getAsset( assetId );
  dispatch( assetListPack.actions.replaceRow( {
    old: assetId,
    new: {
      ...assetVariant,
      url
    }
  } ) )
  dispatch( assetListPack.operations.onRowSelected( {
    id: assetId
  } ) );
  dispatch( assetActions.setForm( 'version' ) );
}
const onTransformChange = ( payload ) => dispatch => dispatch( assetActions.transformEdit( payload ) )

const onAssetClick = ( {
  type,
  asset_type,
  id
}, e ) => dispatch => {
  type = type || asset_type;
  const ids = assetListPack.selectors.getSelectedIds();

  if ( type === 'folder' || type === 'active_folder' ) {
    onFolderClicked( id )( dispatch );
  } else {
    dispatch( assetActions.hidePath() );
    // if (ids.length === 1) {
    //   const asset = assetListPack.selectors.getById(ids[0]);
    //   dispatch(assetListPack.operations.onRowUnselected(asset))
    // }
    const assetSelected = assetListPack.selectors.getById( id );
    if ( e.ctrlKey || e.metaKey ) {
      dispatch( assetListPack.operations.onRowSelected( assetSelected ) )
    } else if ( e.shiftKey ) {
      const filterResults = assetListPack.selectors.getCurrentFilterResults();
      const selectedIds = assetListPack.selectors.getSelectedIds();
      const markerIndex = filterResults.indexOf( id );
      const maxIndex = Math.max( ...selectedIds.map( id => filterResults.indexOf( id ) ) );
      const minIndex = Math.min( ...selectedIds.map( id => filterResults.indexOf( id ) ) );
      if ( markerIndex > maxIndex ) {
        filterResults.filter( ( id, index ) => index > maxIndex && markerIndex >= index ).map( ( id ) => {
          const asset = assetListPack.selectors.getById( id );
          dispatch( assetListPack.operations.onRowSelected( asset ) )
        } )
      } else {
        filterResults.filter( ( id, index ) => index < minIndex && markerIndex <= index ).map( ( id ) => {
          const asset = assetListPack.selectors.getById( id );
          dispatch( assetListPack.operations.onRowSelected( asset ) )
        } )
      }
    } else {
      clearRowSelections()( dispatch );
      dispatch( assetListPack.operations.onRowSelected( assetSelected ) )
    }
  }
};

const onFolderClick = ({ type, asset_type, id }, e) => dispatch => {
  const folderSelected = folderListPack.selectors.getById(id);
  if(e.ctrlKey || e.metaKey){
    dispatch(folderListPack.operations.onRowSelected(folderSelected))
  }
  else if(e.shiftKey){
    const filterResults = folderListPack.selectors.getCurrentFilterResults();
    const selectedIds = folderListPack.selectors.getSelectedIds();
    const markerIndex = filterResults.indexOf( id );
    const maxIndex = Math.max( ...selectedIds.map( id => filterResults.indexOf( id ) ) );
    const minIndex = Math.min( ...selectedIds.map( id => filterResults.indexOf( id ) ) );
    if ( markerIndex > maxIndex ) {
      filterResults.filter( ( id, index ) => index > maxIndex && markerIndex >= index ).map( ( id ) => {
        const asset = folderListPack.selectors.getById( id );
        dispatch( folderListPack.operations.onRowSelected( asset ) )
      } )
    } else {
      filterResults.filter( ( id, index ) => index < minIndex && markerIndex <= index ).map( ( id ) => {
        const asset = folderListPack.selectors.getById( id );
        dispatch( folderListPack.operations.onRowSelected( asset ) )
      } )
    }
  } else {
    clearRowSelections()( dispatch );
    dispatch( folderListPack.operations.onRowSelected( folderSelected ) )
  }
};

const searchInFolder = () => dispatch => {  
  dispatch(assetActions.setExactPath());
  dispatch(assetListPack.operations.onFilterDeleted({
    label: 'Public Assets Only',
    id: 'private',
    input: 'single',
    value: 'private',
    editable: true,
    data: { value: "true", label: 'Me' }
  }));
  dispatch(assetListPack.operations.onFilterSelected({
    label: 'Public Assets Only',
    id: 'private',
    input: 'single',
    value: 'private',
    editable: true,
    data: { value: "true", label: 'Me' }
  }));
}

const assetKeyHandler = event => dispatch => {
  if ( event && assetListPack.selectors.getSelectedIds().length > 0 ) {
    switch ( event.keyCode ) {
      case 39:
        selectNextRow( event, assetListPack )( dispatch );
        break;
      case 37:
        selectPreviousRow( event, assetListPack )( dispatch );
        break;
      case 9:
        if ( event.shiftKey ) {
          selectPreviousRow( event, assetListPack )( dispatch );
        } else {
          selectNextRow( event, assetListPack )( dispatch );
        }
        break;
      default:
        break;
    }
  }
}

const folderKeyHandler = event => dispatch => {
  if ( event && folderListPack.selectors.getSelectedIds().length > 0 ) {
    switch ( event.keyCode ) {
      case 39:
        selectNextRow( event, folderListPack )( dispatch );
        break;
      case 37:
        selectPreviousRow( event, folderListPack )( dispatch );
        break;
      case 9:
        if ( event.shiftKey ) {
          selectPreviousRow( event, folderListPack )( dispatch );
        } else {
          selectNextRow( event, folderListPack )( dispatch );
        }
        break;
      default:
        break;
    }
  }
}

const selectNextRow = (event, listPack) => dispatch => {
  event.stopPropagation();
  event.preventDefault();
  const filterResults = listPack.selectors.getCurrentFilterResults();
  const selectedIds = listPack.selectors.getSelectedIds();
  const maxIndex = Math.max( ...selectedIds.map( id => filterResults.indexOf( id ) ) );
  const lastAssetId = filterResults[ maxIndex ];
  const lastAssetIndex = filterResults.indexOf( lastAssetId );
  let nextAsset;
  if ( lastAssetIndex === filterResults.length - 1 ) {
    nextAsset = listPack.selectors.getById( filterResults[ 0 ] );
  } else {
    nextAsset = listPack.selectors.getById( filterResults[ lastAssetIndex + 1 ] );
    let i = 1
    while ( nextAsset && !isUndefined( nextAsset.selectable ) && !nextAsset.selectable ) {
      nextAsset = listPack.selectors.getById( filterResults[ lastAssetIndex + ++i ] );
    }
  }
  if ( event && !event.shiftKey ) {
    clearRowSelections()( dispatch );
  }
  dispatch( listPack.operations.onRowSelected( nextAsset ) )
};

const selectPreviousRow = (event, listPack) => dispatch => {
  event.stopPropagation();
  event.preventDefault();
  const filterResults = listPack.selectors.getCurrentFilterResults();
  const selectedIds = listPack.selectors.getSelectedIds();
  const minIndex = Math.min(...selectedIds.map(id => filterResults.indexOf(id)));
  const lastAssetId = filterResults[minIndex];
  const lastAssetIndex = filterResults.indexOf(lastAssetId);
  let previousAsset;
  if(lastAssetIndex === 0){
    previousAsset = listPack.selectors.getById(filterResults[filterResults.length-1]);
  }else{
    previousAsset = listPack.selectors.getById(filterResults[lastAssetIndex-1]);
    let i = 1
    while(previousAsset && !isUndefined(previousAsset.selectable) && !previousAsset.selectable){
      previousAsset = listPack.selectors.getById(filterResults[lastAssetIndex - ++i]);
    }
  }
  if(event && (!event.shiftKey || event.keyCode===9)){
    clearRowSelections()(dispatch);
  }
  dispatch(listPack.operations.onRowSelected(previousAsset))
};

const getAssets = ( path ) => () => {
  if ( isUndefined( path ) ) {
    path = '/root';
  }
  const AssetPromise = services.assets.getAssets().notifyStore().send( {
    private: true,
    path,
    exact_path: true,
    exclude: {
      asset_type:'folder'
    }
  } );
  const FolderPromise = services.assets.getFolderAssets().notifyStore().send( {
    private: true,
    path,
    exact_path: true,
  } );
  return Promise.all( [ FolderPromise, AssetPromise ] );
};

const fetchFilters = () => () => {
  return services.assets.getFilters().notifyStore().send()
}

const clearRowSelections = () => dispatch => {
  dispatch( assetListPack.operations.onClearRowSelections() );
  dispatch( folderListPack.operations.onClearRowSelections() )
}

const clearAssetAndFolderSelections = () => dispatch =>  {
  dispatch(assetListPack.operations.onClearRowSelections());
  dispatch(folderListPack.operations.onClearRowSelections())
}

export default {
  ...getOperations( assetActions ),
  onAssetClick,
  clearRowSelections,
  clearAssetAndFolderSelections,
  getAssets,
  onHide,
  onRetryTask,
  onRetryUpload,
  setActiveAsset,
  setActiveVariant,
  onTransformChange,
  onConfirmTransform,
  onConfirmFilter,
  onAttributeChange,
  onAttributeDelete,
  onFileSelected,
  searchInFolder,
  onPathClicked,
  confirmBulkTag,
  navigateFullScreen,
  selectNextRow,
  selectPreviousRow,
  assetKeyHandler,
  folderKeyHandler,
  onSave,
  onDelete,
  saveVariant,
  profilePicUpload,
  selectAll,
  selectAllFolders,
  unselectAllFolders,
  onFilterSelected,
  fetchFilters,
  unselectAll,
  getFolders,
  moveAll,
  showLicenseModal,
  selectSubscription,
  onFolderClick,
  onFolderClicked,
  onCreateFolder,
  onCloseFolder,
  onFolderChange,
  onConfirmFolder,
  performAction,
  selectTeams,
  confirmShare,
  purgePath,
  /* For Annotation Form */
  onTagAdded,
  onTagDeleted,
  onAttributeAdded,
  onAttributeDeleted,
  onUpload,
  ...shutterstockOperations
};