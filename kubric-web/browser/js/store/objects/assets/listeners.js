import store from '../..';
import routeTypes from '../route/types';
import assetActions from './actions';
import userSelectors from '../user/selectors';
import { ASSET_ROUTE, ASSETS_ROUTE } from "../../../routes";
import rtManager from '../../../lib/rtmanager';
import { setWorkspace } from "../servicetypes";
import { Firebase } from '../../../lib/firebase';
import routeSelectors from '../route/selectors';
import services from '../../../services';
import { assettaskworker } from '../../../workers/listeners';
  
const getAsset = (asset = {}) => ({
  ...asset,
  id: asset.created_for,
  selectable: true,
  actionable: true,
  hoverable: false,
  asset_type: 'loading_asset',
  url: "None"
});

const getAssets = (assets = {}, isList = false) =>
  (isList ? Object.keys(assets).map(key => getAsset(assets[key])) : [getAsset(assets)])
    .filter(({ type }) => type !== 'ArchiveTask').filter(({ type }) => type !== 'UploadArchiveTask');

const getCurrentFolderId = () => {
  const { folderId = 'root' } = routeSelectors.getRouteParams();
  return folderId;
};

const getFolderPath = folderId => {
  const workspaceId = userSelectors.getWorkspaceId();
  const email = userSelectors.getUserEmail();
  return `asset_tasks/${workspaceId}/${email.replace(/\./g, ",")}`
};

const getActionPayload = (folderId, asset) => ({
  path: folderId,
  appendAt: 'start',
  hits: Array.isArray(asset) ? asset : [asset]
});

const getZeroStatusRef = collectionRef => collectionRef.where("status", "==", 0);

const listenAssetTaskAdded = action => {
  const folderId = getCurrentFolderId();
  const routeId = routeSelectors.getRouteId();
  const childAddedHandler = payload => {
    if (payload.progress < 40) {
      store.dispatch(assetActions.folderUploadsFetched(getActionPayload(folderId === '/root' ? 'root' : folderId, getAssets(payload))));
    }
  };

  if (routeId === ASSET_ROUTE || routeId === ASSETS_ROUTE) {
    return Firebase.init()
      .then(() => {

        const firebase = Firebase.getProdApp();
				const db = firebase.firestore();
        const folderRef = db.collection(getFolderPath(folderId)).where("meta.folder", "==", folderId);
        const statusZeroRef = getZeroStatusRef(folderRef);

        const unsubscribe = statusZeroRef.onSnapshot(
					querySnapshot => {
						querySnapshot.docChanges.forEach(change => {
              const payload = change.doc.data();
							if (change.type === "added") {
								childAddedHandler(payload)
							}
						});
					},
					error => {
						console.log(`Firebase error: ${error}`);
					}
				);
        
       
        return {
          types: [setWorkspace.INITIATED, routeTypes.ROUTE_LOADED],
          handler: unsubscribe
        };
      });
  }
};

const listenAssetTaskChanged = () => {
  if (!userSelectors.isWorkspaceSet()) {
    return;
  }
  const routeId = routeSelectors.getRouteId();
  if (routeId === ASSET_ROUTE || routeId === ASSETS_ROUTE) {
    const folderId = getCurrentFolderId();

    const childChangedHandler = payload => {
      const asset = payload;
      const { status = 0, created_for: id, progress, type } = asset;
      if (progress < 60) {
        store.dispatch(assetActions.folderUploadsFetched(getActionPayload(folderId, getAssets(asset))))
      } else if (progress > 60 && type !=="ArchiveTask") {
        services.assets.getAsset()
          .send({
            id,
          })
          .then(asset => store.dispatch(assetActions.folderUploadsFetched(getActionPayload(folderId, asset))));
      }
    };

    return Firebase.init()
      .then(() => {
        const firebase = Firebase.getProdApp();
        const db = firebase.firestore();
        const folderRef = db.collection(getFolderPath(folderId)).where("meta.folder", "==", folderId);
        const statusZeroRef = getZeroStatusRef(folderRef);

        const unsubscribe = statusZeroRef.onSnapshot(
          querySnapshot => {
            querySnapshot.docChanges.forEach(change => {
              const payload = change.doc.data();
              if (change.type === "modified") {
                childChangedHandler(payload)
              }
            });
          },
          error => {
            console.log(`Firebase error: ${error}`);
          }
        );

        return {
          types: [setWorkspace.INITIATED, routeTypes.ROUTE_LOADED],
          handler: unsubscribe
        };
      })
  }
};

rtManager.registerListener([routeTypes.ROUTE_LOADED, setWorkspace.COMPLETED], listenAssetTaskAdded);
rtManager.registerListener([routeTypes.ROUTE_LOADED, setWorkspace.COMPLETED], listenAssetTaskChanged);
rtManager.registerListener([routeTypes.ROUTE_LOADED, setWorkspace.COMPLETED], assettaskworker);