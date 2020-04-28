import actions from './actions';
import services from '../../../../services';
import campaignSelectors from "../selectors";
import { TABS_FILTER } from "./list/filters";
import creativesListPack from '../creatives/list';
import assetTaskSelectors from '../../assettasks/selectors';
import assettasksOperations from '../../assettasks/operations';
import chatOperations from "../../chat/operations";
import assetActions from '../../assets/actions';
import spinnerActions from '../../spinner/actions';
import { getBulkEditUrl, getCreativeEditUrl } from "../../../../lib/links";
import { redirect } from "@bit/kubric.utils.common.router";
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import { isUndefined, isString, at, isFunction } from "@bit/kubric.utils.common.lodash";
import notificationActions from '../../notifications/actions';
import { statuses } from "../../../../../../isomorphic/constants/creatives";
import { utilActions } from "../../commons/actions";
import creativeActions from "../creative/actions";
import bulkEditActions from "../bulkedit/actions";
import bulkEditSelectors from "../bulkedit/selectors";

const onClearRowSelections = () => dispatch => {
  dispatch(creativesListPack.actions.clearRowSelections());
};

const onSelectedRowsChange = data => dispatch =>
  dispatch(creativesListPack.actions.selectedRowsChange({
    path: 'content',
    data,
  }));

const onSave = () => () => {
  const dirtyRows = creativesListPack.selectors.getDirtyData();
  const campaignId = campaignSelectors.getCampaignId();
  dirtyRows.map(ad => {
    const id = ad.uid;
    services.ads.updateAd()
      .notifyStore()
      .send({
        ad: {
          ...ad,
          id,
        },
        campaignId,
      }, {
        extraData: {
          id,
        }
      });
  });
};

const bulkAction = (service, message = {}, showSpinner, status, qcStatus) =>
  dispatch => {
    const campaignId = campaignSelectors.getCampaignId();
    let handler;
    if (!isString(service)) {
      handler = service.handler;
      service = service.service;
    }
    const [resource, serviceName] = service.split('.');
    showSpinner && dispatch(spinnerActions.showSpinner());
    const hideSpinner = hasErred => setTimeout(() => {
      dispatch(spinnerActions.hideSpinner());
      if (!hasErred && !isUndefined(message.heading)) {
        dispatch(notificationActions.addNotification({
          type: 'success',
          ...message
        }));
      }
    }, 6000);
    services[resource][serviceName]()
      .notifyStore()
      .send({
        campaignId,
        status,
        qcStatus
      })
      .then(() => showSpinner && hideSpinner())
      .then(() => isFunction(handler) && handler(dispatch, status))
      .catch(ex => {
        console.error(ex);
        showSpinner && hideSpinner(true)
      });
  };

const generateCreative = (adId, campaignId, index) => dispatch =>
  services.campaign.singleAdVideo()
    .notifyStore()
    .send({
      campaignId,
      adId,
    }, {
      extraData: {
        id: adId,
        index,
      }
    })
    .then(() => {
      dispatch(creativesListPack.actions.rowChange({
        id: adId,
        data: {
          status: statuses.GENERATION_PENDING
        }
      }));
    });

const deleteCampaignAd = (adId, campaignId, index) => dispatch =>
  services.campaign.deleteCreative()
    .notifyStore()
    .send({
      campaignId,
      adId,
    }, {
      extraData: {
        id: adId,
        index,
      }
    })
    .then(() => {
      dispatch(creativesListPack.actions.rowDeleted({
        uid: adId
      }))
    });

const triggerCreativeAction = (methodName = '', adId, campaignId, index, data = {}) => () => {
  const [method] = at(services, methodName);
  method()
    .notifyStore()
    .send({
      campaignId,
      creativeId: adId,
      ...data
    }, {
      extraData: {
        id: adId,
        index,
      }
    });
};

const updateCampaignAd = triggerCreativeAction.bind(null, 'campaign.saveCreative');

const resolveCreative = triggerCreativeAction.bind(null, 'campaign.resolveCreative');

const actionOnSelected = (handler, data = {}) => dispatch => {
  const campaignId = campaignSelectors.getCampaignId();
  const { results, selected } = creativesListPack.resolvers.getListData();
  selected.forEach(rowIndex => handler(results[rowIndex].uid, campaignId, rowIndex, data)(dispatch));
};

const filterMissingAssets = () => dispatch => {
  dispatch(creativesListPack.operations.onFilterCleared());
  dispatch(creativesListPack.operations.onFilterSelected({
    label: 'Status',
    value: 'status',
    id: 'status',
    input: 'single',
    editable: true,
    data: {
      value: "creation-erred",
      label: 'Mising Assets'
    }
  }))
};

const onEdit = () => () => {
  const selectedCampaign = campaignSelectors.getCampaignId();
  const [selectedCreative] = creativesListPack.selectors.getSelectedIds();
  redirect(getCreativeEditUrl(selectedCampaign, selectedCreative));
};

const onStatusReport = () => () => window.open(
  services.campaign.downloadResults()
    .getUrl({
      campaignId: campaignSelectors.getCampaignId(),
    }));

const onErrorReport = () => () => window.open(
  services.campaign.downloadAdErrors()
    .getUrl({
      campaignId: campaignSelectors.getCampaignId(),
    }));

const onDownloadCreatives = () => dispatch => {
  const id = campaignSelectors.getExportedFolder();
  services.assets.download()
    .notifyStore()
    .send({
      id
    })
    .then((res) => {
      dispatch(assetActions.showTasks());
      dispatch(triggerDownload(res.task_id));
    });
};

const triggerDownload = task_id => {
  const tasks = assetTaskSelectors.assettasks();
  const task = Object.keys(tasks).filter(task => {
    if (tasks[task].uid === task_id) {
      return task
    }
  });
  if (task && task[0] && task[0].message === 'Zipping folder completed') {
    window.open(task.result, '_blank');
  } else {
    setTimeout(() => {
      triggerDownload(task_id);
    }, 500);
  }
};

const onTabChanged = tabId => dispatch => {
  const filterObject = {
    id: 'tabs',
    data: {
      value: tabId
    }
  };
  dispatch(creativesListPack.actions.clearSelectedFilters());
  dispatch(actions.tabLoading(tabId));
  dispatch(actions.tabChanged(tabId));
  creativesListPack.operations.onFilterSelected(filterObject)(dispatch)
    .then(() => dispatch(actions.tabLoaded(tabId)));
  onClearRowSelections()(dispatch);
};

const onFilterSelected = (config, value) => dispatch => {
  const { data } = config;
  const isStringValue = isString(value);
  const isAddFilter = (isStringValue && value.length > 0) || value;
  const { selected = [] } = creativesListPack.selectors.getFilters();
  const hasTabs = selected.some(({ id }) => id === TABS_FILTER);
  if (hasTabs) {
    creativesListPack.operations.onClearSelectedFilters()(dispatch);
  }
  let operation;
  if (isUndefined(data)) {
    operation = isAddFilter ? creativesListPack.operations.onFilterSelected({
      ...config,
      value
    }) : creativesListPack.operations.onFilterDeleted(config);
  } else {
    operation = creativesListPack.operations[isAddFilter ? 'onFilterSelected' : 'onFilterDeleted'](config);
  }
  return operation(dispatch);
};

const onDownloadRows = () => () => window.open(
  services.campaign.downloadRows()
    .getUrl({
      campaignId: campaignSelectors.getCampaignId(),
    }));

const initateChat = ({ uid } = {}, dispatch) => {
  const creative = creativesListPack.selectors.getById(uid);
  chatOperations.onChatInitiated(creative)(dispatch);
};

const setCreative = (dispatch, payload) => {
  const { uid } = payload;
  const adData = creativesListPack.selectors.getById(uid);
  dispatch(creativeActions.creativeFetched(adData));
};

const onClearAndSelect = payload => dispatch => {
  creativesListPack.operations.onClearAndSelect(payload)(dispatch);
  setCreative(dispatch, payload);
  initateChat(payload, dispatch);
};

const checkAndInitiateChat = dispatch => {
  const { selected = [], results = {} } = creativesListPack.resolvers.getListData();
  if (selected.length === 1) {
    initateChat(results[selected[0]], dispatch);
  }
};

const onRowSelected = payload => dispatch => {
  creativesListPack.operations.onRowSelected(payload)(dispatch);
  setCreative(dispatch, payload);
  checkAndInitiateChat(dispatch);
};

const onRowUnselected = payload => dispatch => {
  creativesListPack.operations.onRowUnselected(payload)(dispatch);
  checkAndInitiateChat(dispatch);
};

const markGenerationQueued = (dispatch, status) => {
  const creatives = creativesListPack.selectors.getAllData();
  const actions = Object.keys(creatives).reduce((actions, creativeId) => {
    const creative = creatives[creativeId];
    if (creative.status === status) {
      actions.push(creativesListPack.actions.rowChange({
        status: statuses.GENERATION_PENDING
      }))
    }
    return actions;
  }, []);
  dispatch(utilActions.batchedAction(actions));
};

const onClearSelectedFilters = () => dispatch => {
  creativesListPack.operations.onClearSelectedFilters()(dispatch);
  creativesListPack.operations.onFilterSelected({
    id: TABS_FILTER,
    data: {
      value: "all"
    }
  })(dispatch);
};

const onBulkEdit = () => dispatch => {
  const campaignId = campaignSelectors.getCampaignId();
  dispatch(bulkEditActions.initiated());
  const commonParameters = bulkEditSelectors.getParameters();
  const numParameters = commonParameters.reduce((acc, shotParams) => acc + Object.keys(shotParams).length, 0);
  if (numParameters > 0) {
    redirect(getBulkEditUrl(campaignId));
  } else {
    dispatch(notificationActions.addNotification({
      type: 'info',
      heading: "Editing disabled",
      desc: `The selected ads do not have any common parameters that can be edited in bulk`
    }));
  }
};

export default {
  ...getOperations(actions),
  onFilterSelected,
  onSave,
  onEdit,
  onTabChanged,
  onErrorReport,
  onStatusReport,
  onDownloadCreatives,
  onGenerateSelected: actionOnSelected.bind(null, generateCreative),
  onApproveSelectedCopy: actionOnSelected.bind(null, updateCampaignAd, {
    manualCopyQCStatus: "success"
  }),
  onRejectSelectedCopy: actionOnSelected.bind(null, updateCampaignAd, {
    manualCopyQCStatus: "failure"
  }),
  onApproveSelectedVisual: actionOnSelected.bind(null, updateCampaignAd, {
    manualVisualQCStatus: "success"
  }),
  onRejectSelectedVisual: actionOnSelected.bind(null, updateCampaignAd, {
    manualVisualQCStatus: "failure"
  }),
  onResolveSelected: actionOnSelected.bind(null, resolveCreative),
  onDeleteSelected: actionOnSelected.bind(null, deleteCampaignAd),
  filterMissingAssets,
  onSelectedRowsChange,
  onRowSelected,
  onRowUnselected,
  onClearRowSelections,
  onGenerate: bulkAction.bind(null, {
    service: 'campaign.generateAdVideos',
    handler: markGenerationQueued
  }, {
    heading: "Generating all videos",
  }, true),
  onRetryGeneration: bulkAction.bind(null, {
    service: 'campaign.retryAdVideos',
    handler: markGenerationQueued
  }, {
    heading: "Retrying video generation",
  }, true),
  onResolveCreatives: bulkAction.bind(null, 'campaign.resolveCreatives', {
    heading: "Resolving assets",
  }, true),
  onPublish: bulkAction.bind(null, 'campaignpublisher.publishCampaignAds', {
    heading: "Publishing creatives",
  }, true),
  onRetryPublish: bulkAction.bind(null, 'campaignpublisher.retryPublishAds', {
    heading: "Retrying publish",
  }, true),
  approveCopyQC: bulkAction.bind(null, 'campaign.approveCopyQC', {
    heading: "Approving copy",
  }, false),
  rejectCopyQC: bulkAction.bind(null, 'campaign.rejectCopyQC', {
    heading: "Rejecting copy",
  }, false),
  approveVisualQC: bulkAction.bind(null, 'campaign.approveVisualQC', {
    heading: "Approving visuals",
  }, false),
  rejectVisualQC: bulkAction.bind(null, 'campaign.rejectVisualQC', {
    heading: "Rejecting copy",
  }, false),
  onBulkEdit,
  onDownloadRows,
  onClearAndSelect,
  onClearSelectedFilters
};