import { h } from 'preact';
import { PrimaryButton } from "../../../../../../components/commons/misc";
import {
  creativeTabs,
  statuses as creativeStatuses,
  statsPathMap
} from "../../../../../../../../isomorphic/constants/creatives";
import { Menu, MenuItem } from "../../../../../../components/commons/Menu";
import { at, isFunction } from "@bit/kubric.utils.common.lodash";
import Resolver from '@bit/kubric.utils.common.json-resolver';
import styles from 'stylesheets/campaign/creatives/table/actions';

const generatedCondition = ({ selected = [] }) => selected.every(({ status }) => status !== creativeStatuses.CREATION_ERRED);

const approvedCondition = ({ selected = [] }) => selected.every(({ status, manual_qc_status }) => status === creativeStatuses.GENERATION_COMPLETED || manual_qc_status === "failure");

const rejectedCondition = ({ selected = [], manual_qc_status }) => selected.every(({ status }) => status === creativeStatuses.GENERATION_COMPLETED || manual_qc_status === 'success');

const selectedCondition = ({ selected = [] }) => selected.length > 0;

const mulitpleSelectedCondition = ({ selected = [] }) => selected.length > 1;

const unselectedCondition = ({ selected = [] }) => selected.length === 0;

const selectedLabelData = ({ selected }) => ({
  count: selected.length
});

/**
 * Keys that identify actions that can be shown in the actions dropdown menu
 */
const actionKeys = {
  ...creativeStatuses,
  GENERATE_SELECTED: 'generate-selected',
  APPROVE_SELECTED_COPY: 'approve-selected-copy',
  REJECT_SELECTED_COPY: 'reject-selected-copy',
  APPROVE_ALL_COPY: 'approve-all-copy',
  REJECT_ALL_COPY: 'reject-all-copy',
  APPROVE_SELECTED_VISUAL: 'approve-selected-visual',
  REJECT_SELECTED_VISUAL: 'reject-selected-visual',
  APPROVE_ALL_VISUAL: 'approve-all-visual',
  REJECT_ALL_VISUAL: 'reject-all-visual',
  DOWNLOAD_ROWS: 'download-rows',
  UPLOAD_CREATIVES: 'upload-creatives',
  DELETE_CREATIVES: 'delete-creatives',
  RESOLVE_CREATIVES: 'resolve-creatives',
  BULK_EDIT: 'bulk-edit'
};

const {
  CREATION_COMPLETED,
  CREATION_ERRED,
  GENERATION_ERRED,
  GENERATE_SELECTED,
  APPROVE_SELECTED_COPY,
  REJECT_SELECTED_COPY,
  APPROVE_ALL_COPY,
  REJECT_ALL_COPY,
  APPROVE_SELECTED_VISUAL,
  REJECT_SELECTED_VISUAL,
  APPROVE_ALL_VISUAL,
  REJECT_ALL_VISUAL,
  DOWNLOAD_ROWS,
  UPLOAD_CREATIVES,
  DELETE_CREATIVES,
  RESOLVE_CREATIVES,
  BULK_EDIT
} = actionKeys;

/**
 * Maps every action key to the a location in the stats object. Only if the count at this location is > 0, will the
 * action be available in the UI
 */
const statsPaths = {
  ...statsPathMap,
  [GENERATE_SELECTED]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [APPROVE_SELECTED_COPY]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [REJECT_SELECTED_COPY]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [APPROVE_ALL_COPY]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [REJECT_ALL_COPY]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [APPROVE_SELECTED_VISUAL]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [REJECT_SELECTED_VISUAL]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [APPROVE_ALL_VISUAL]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [REJECT_ALL_VISUAL]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [DOWNLOAD_ROWS]: 'all',
  [UPLOAD_CREATIVES]: 'all',
  [DELETE_CREATIVES]: 'all',
  [BULK_EDIT]: statsPathMap[creativeStatuses.GENERATION_COMPLETED],
  [RESOLVE_CREATIVES]: 'all'
};

/**
 * Defines the label to be shown, function that needs to be called for every action. If condition is provided, this
 * condition should return true for the action to be shown in the UI
 */
const actionMap = {
  [CREATION_COMPLETED]: {
    label: "Generate creatives({{count}})",
    action: "onGenerate",
    checkCount: true,
    condition: unselectedCondition
  },
  [CREATION_ERRED]: {
    label: "Resolve assets({{count}})",
    action: "onResolveCreatives",
    checkCount: true,
    condition: unselectedCondition
  },
  [GENERATION_ERRED]: {
    label: "Retry generation({{count}})",
    action: "onRetryGeneration",
    checkCount: true,
    condition: unselectedCondition
  },
  [GENERATE_SELECTED]: {
    label: "Generate selected({{count}})",
    action: "onGenerateSelected",
    condition: [selectedCondition, generatedCondition],
    labelData: selectedLabelData
  },
  [APPROVE_SELECTED_COPY]: {
    label: "Approve copy({{count}})",
    action: "onApproveSelectedCopy",
    condition: [selectedCondition, approvedCondition],
    labelData: selectedLabelData
  },
  [REJECT_SELECTED_COPY]: {
    label: "Reject copy({{count}})",
    action: "onRejectSelectedCopy",
    condition: [selectedCondition, rejectedCondition],
    labelData: selectedLabelData
  },
  [APPROVE_ALL_COPY]: {
    label: "Approve copy({{count}})",
    action: "approveCopyQC",
    checkCount: true,
    condition: unselectedCondition
  },
  [REJECT_ALL_COPY]: {
    label: "Reject copy({{count}})",
    action: "rejectCopyQC",
    checkCount: true,
    condition: unselectedCondition
  },
  [APPROVE_SELECTED_VISUAL]: {
    label: "Approve visual({{count}})",
    action: "onApproveSelectedVisual",
    condition: [selectedCondition, approvedCondition],
    labelData: selectedLabelData
  },
  [REJECT_SELECTED_VISUAL]: {
    label: "Reject visual({{count}})",
    action: "onRejectSelectedVisual",
    condition: [selectedCondition, rejectedCondition],
    labelData: selectedLabelData
  },
  [APPROVE_ALL_VISUAL]: {
    label: "Approve visual({{count}})",
    action: "approveVisualQC",
    checkCount: true,
    condition: unselectedCondition
  },
  [REJECT_ALL_VISUAL]: {
    label: "Reject visual({{count}})",
    action: "rejectVisualQC",
    checkCount: true,
    condition: unselectedCondition
  },
  [DOWNLOAD_ROWS]: {
    label: "Download creatives",
    action: "onDownloadRows"
  },
  [UPLOAD_CREATIVES]: {
    label: "Upload creatives",
    action: "onOpenUpload"
  },
  [DELETE_CREATIVES]: {
    label: "Delete selected({{count}})",
    action: "onDeleteSelected",
    condition: [selectedCondition],
    labelData: selectedLabelData
  },
  [RESOLVE_CREATIVES]: {
    label: "Resolve selected({{count}})",
    action: "onResolveSelected",
    condition: [selectedCondition],
    labelData: selectedLabelData
  },
  [BULK_EDIT]: {
    label: "Edit selected({{count}})",
    action: "onBulkEdit",
    condition: [mulitpleSelectedCondition, generatedCondition],
    labelData: selectedLabelData
  }
};

/**
 * Defines actions that are applicable under every tab
 */
const tabActionsMap = {
  [creativeTabs.FILTERED]: [
    CREATION_COMPLETED,
    CREATION_ERRED,
    GENERATION_ERRED,
    BULK_EDIT,
    GENERATE_SELECTED,
    APPROVE_SELECTED_COPY,
    REJECT_SELECTED_COPY,
    APPROVE_ALL_COPY,
    REJECT_ALL_COPY,
    APPROVE_SELECTED_VISUAL,
    REJECT_SELECTED_VISUAL,
    APPROVE_ALL_VISUAL,
    REJECT_ALL_VISUAL,
    DOWNLOAD_ROWS,
    UPLOAD_CREATIVES,
    DELETE_CREATIVES,
    RESOLVE_CREATIVES
  ],
  [creativeTabs.ALL]: [
    CREATION_COMPLETED,
    CREATION_ERRED,
    GENERATION_ERRED,
    BULK_EDIT,
    GENERATE_SELECTED,
    APPROVE_SELECTED_COPY,
    REJECT_SELECTED_COPY,
    APPROVE_ALL_COPY,
    REJECT_ALL_COPY,
    APPROVE_SELECTED_VISUAL,
    REJECT_SELECTED_VISUAL,
    APPROVE_ALL_VISUAL,
    REJECT_ALL_VISUAL,
    DOWNLOAD_ROWS,
    UPLOAD_CREATIVES,
    DELETE_CREATIVES,
    RESOLVE_CREATIVES
  ],
  [creativeTabs.GENERATED]: [
    BULK_EDIT,
    GENERATE_SELECTED,
    APPROVE_SELECTED_COPY,
    REJECT_SELECTED_COPY,
    APPROVE_ALL_COPY,
    REJECT_ALL_COPY,
    APPROVE_SELECTED_VISUAL,
    REJECT_SELECTED_VISUAL,
    APPROVE_ALL_VISUAL,
    REJECT_ALL_VISUAL,
    DOWNLOAD_ROWS,
    UPLOAD_CREATIVES,
    DELETE_CREATIVES
  ],
  [creativeTabs.FAILED]: [
    CREATION_ERRED,
    GENERATION_ERRED,
    GENERATE_SELECTED,
    DOWNLOAD_ROWS,
    UPLOAD_CREATIVES,
    DELETE_CREATIVES,
    RESOLVE_CREATIVES
  ],
  [creativeTabs.INPROGRESS]: [
    GENERATE_SELECTED,
    DOWNLOAD_ROWS,
    UPLOAD_CREATIVES,
    DELETE_CREATIVES,
    RESOLVE_CREATIVES
  ],
  [creativeTabs.READY]: [
    CREATION_COMPLETED,
    GENERATE_SELECTED,
    DOWNLOAD_ROWS,
    UPLOAD_CREATIVES,
    DELETE_CREATIVES,
    RESOLVE_CREATIVES
  ]
};

const actionButton = <PrimaryButton showDropArrow={true}>Actions</PrimaryButton>;

const verifyConditions = (props, conditions = []) => {
  if (isFunction(conditions)) {
    conditions = [conditions];
  }
  if (conditions.length > 0) {
    return conditions.every(condition => isFunction(condition) ? condition(props) : !!condition);
  }
  return true;
};

export default props => {
  const { stats = {}, tabId } = props;
  const possibleActions = tabActionsMap[tabId] || [];
  if (possibleActions.length === 0) {
    return <span/>
  } else {
    const resolver = new Resolver({
      replaceUndefinedWith: ''
    });
    const menuItems = possibleActions.reduce((acc, action) => {
      let countPath = statsPaths[action];
      countPath = Array.isArray(countPath) ? countPath[1] : countPath;
      const [count] = at(stats, countPath, 0);
      let { label, action: actionHandler, condition = [], labelData = { count }, checkCount = false } = actionMap[action];
      labelData = isFunction(labelData) ? labelData(props) : labelData;
      if ((!checkCount || (checkCount && count > 0)) && verifyConditions(props, condition)) {
        acc.push(<MenuItem onClick={props[actionHandler]}>{resolver.resolve(label, labelData)}</MenuItem>);
      }
      return acc;
    }, []);
    return menuItems.length > 0 ? (
      <Menu iconElement={actionButton} theme={styles}>
        {menuItems}
      </Menu>
    ) : <span/>;
  }
};