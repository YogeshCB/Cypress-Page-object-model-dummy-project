import Assets from './assets/index';
import { connect } from 'preact-redux';
import store from '../store';
import assetSelectors from '../store/objects/assets/selectors/index';
import assetActions from '../store/objects/assets/actions';
import assetOperations from '../store/objects/assets/operations/index';
import assettasksOperations from '../store/objects/assettasks/operations';
import workspaceOperations from '../store/objects/workspace/operations';
import workspaceActions from '../store/objects/workspace/actions';
import userSelectors from '../store/objects/user/selectors';
import teamSelectors from '../store/objects/team/selectors';
import assetListPack from '../store/objects/lists/assets/index';
import folderListPack from '../store/objects/lists/assets/folders';
import StoreResolver from '../mixins/PropResolver';
import networkOperations from '../store/objects/profile/operations/networks';
import teamOperations from '../store/objects/team/operations';
import { isUndefined } from 'util';
import uploadListPack from "../store/objects/assets/fileuploads";

const StoreResolvedComponent = StoreResolver(Assets, {
  foldersList: folderListPack.resolvers.getListData,
  data: assetListPack.resolvers.getListData,
});

const ConnectedComponent = connect(state => {
  return ({
    query: assetListPack.selectors.getCurrentQuery(),
    filters: assetListPack.selectors.getFilters(),
    loading: assetListPack.selectors.isQueryFilterLoading(),
    completed: assetListPack.selectors.isQueryFilterCompleted(),
    userEmail: userSelectors.getUserEmail(),
    files: assetSelectors.getFiles(),
    tags: assetSelectors.getTags(),
    folders: assetSelectors.getFolders(),
    form: assetSelectors.getFormStatus(),
    uploadModalStatus: assetSelectors.getUploadModalStatus(),
    transformData: assetSelectors.getTransformData(),
    selectedForm: assetSelectors.getTransformFormState(),
    showDeleteVariant: assetSelectors.getVariantDeleteModalStatus(),
    transformUrls: assetSelectors.getTransformUrls(),
    annotation_attributes: assetSelectors.getAttributes(),
    grid: assetSelectors.getGridStatus(),
    errorMessage: assetSelectors.getErrorMessage(),
    showFolderDetailsStatus: assetSelectors.getFolderDetailStatus(),
    variantNameDialog: assetSelectors.getVariantNameDialog(),
    selectedFolderAssets: folderListPack.selectors.getSelectedIds(),
    selectedAssetIds: assetListPack.selectors.getSelectedIds(),
    showAnnotationModal: assetSelectors.getModalStatus(),
    filterString: assetListPack.selectors.getFiltersAsQuery(),
    currentQueryData: assetListPack.selectors.getCurrentFilterData(),
    showFullscreen: assetSelectors.getFullScreenStatus(),
    licenseModal: assetSelectors.getLicenseModalStatus(),
    chosenSubscription: assetSelectors.getSelectedSubscription(),
    subscriptions: assetSelectors.getSubscriptions(),
    loadingSubscription: assetSelectors.getLoadingSubscription(),
    licensedData: assetSelectors.getLicensedData(),
    hoveredIndex: assetSelectors.getHoveredIndex(),
    teams: teamSelectors.getTeams(state),
    uploadMenu: assetSelectors.getUploadMenuStatus(),
    exactPath: assetSelectors.getExactPath(),
    folder: assetSelectors.getFolderData(),
    folderName: assetSelectors.getCurrentFolderName(),
    selectedFolderPath: assetSelectors.getSelectedFolderPath(),
    showFolderPath: assetSelectors.getSelectedFolderPathStatus(),
    taggingForm: assetSelectors.tagFormStatus(),
    tagFormLoading: assetSelectors.tagFormLoading(),
    showFilters: assetSelectors.getFilterStatus(),
    warningModal: assetSelectors.getWarningModalStatus(),
    folderUpdateStatus: assetSelectors.getUpdateFolderStatus(),
    myAssets: assetListPack.selectors.getState(),
    folderAssets: folderListPack.selectors.getState(),
    showTasksModal: assetSelectors.getShowTasksModal(),
  });
}, {
  ...networkOperations.shutterstock,
  ...assetActions,
  ...assetListPack.operations,
  ...assetOperations,
  onSelectTeams: teamOperations.onSelectTeams,
  onFolderRowChange: folderListPack.operations.onRowChange,
  clearRowSelections: assetListPack.operations.onClearRowSelections,
  onClearAssetSelections: () => {
    store.dispatch(assetOperations.clearRowSelections());
    store.dispatch(assetActions.hideFolderDetails());
  }
})(StoreResolvedComponent);

const beforeUnloadHandler = e => {
  const confirmationMessage = "Some assets are still uploading. You still want to continue? ";

  //  //Gecko + IE //Webkit, Safari, Chrome
  if (uploadListPack.selectors.getInProgress().length > 0) {
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
};

const offlineHandler = e => {
  const inProgress = [...uploadListPack.selectors.getInProgress(), ...uploadListPack.selectors.getInInitiated()]
  inProgress.map(task => {
    const data = assetSelectors.getAsset(task);
    store.dispatch(uploadListPack.actions.failed({
      data,
      task,
      key: task,
      file: data.file
    }));
    if (task) {
      store.dispatch(assetListPack.actions.replaceRow({
        old: task,
        new: {
          ...data,
          file: data.file,
          id: task,
          key: task,
          selectable: false,
          actionable: false,
          hoverable: false,
          hasErred: true,
          message: 'Upload Failed',
        }
      }));
    }
  })
};

const initiOfflineWarning = () => {
  window.addEventListener("beforeunload", beforeUnloadHandler);
  window.addEventListener('offline', offlineHandler);
};

export const routeWillLoad = ({ params = {} }) => {
  if (!userSelectors.isWorkspaceSet()) {
    return ConnectedComponent;
  }
  assetListPack.operations.onPurgeList()(store.dispatch);
  folderListPack.operations.onPurgeList()(store.dispatch);

  store.dispatch(assetListPack.actions.clearRowSelections());
  assettasksOperations.fetchAssetImageFilters()(store.dispatch);
  initiOfflineWarning();

  const folderId = params.folderId;
  assetListPack.operations.onFilterCleared()(store.dispatch);  

  store.dispatch(folderListPack.actions.queryChange(folderId || ""));

  teamOperations.fetchTeams()(store.dispatch);

  store.dispatch(assetListPack.actions.filterSelected({
    label: 'Public Assets Only',
    id: 'private',
    input: 'single',
    value: 'private',
    editable: true,
    data: { value: "true", label: 'Me' }
  }));
  store.dispatch(assetActions.folderAssetsFetched({
    folderId: '/root'
  })); 

  
  store.dispatch(assetOperations.fetchFilters())
    .then(res => {
      store.dispatch(assetListPack.actions.filterSourceChanged(res.filters));
    });

  if (!isUndefined(folderId)) {
    store.dispatch(assetActions.folderClicked({
      path: folderId,
    }));
  } else {
    assetOperations.purgePath()(store.dispatch);
  }


  return store.dispatch(assetOperations.getAssets(folderId))
    .then(res => {
      const folderResponse = res[0];
      const assetResponse = res[1];

      store.dispatch(assetActions.folderAssetsFetched({
        folderId: folderId ? folderId : '/root',
        ...folderResponse
      }));
      if (assetResponse.status_code === 403) {
        workspaceOperations.setWorkspace('')(store.dispatch);
        store.dispatch(workspaceActions.setMessage(assetResponse.message));
      } else {
        if (assetResponse) {
          if (!isUndefined(folderId)) {
            store.dispatch(assetActions.folderClicked({
              navPath: assetResponse.path,
              path: folderId,
              names: assetResponse.path_names
            }));
          }
        } else {
          store.dispatch(assetActions.folderClicked({
            navPath: '/root',
            path: folderId ? folderId : '/root',
            names: ["Home"]
          }));
        }
      }

      store.dispatch(assetActions.assetsFetched(assetResponse));
      return ConnectedComponent;
    });
};
