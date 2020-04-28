import { h } from 'preact';
import Actions from './Actions';
import config from "../../../../../config";
import fontIcons from "stylesheets/icons/fonticons";
import appIcons from 'stylesheets/icons/app';
import { Spinner } from "../../../../../components";
import styles from 'stylesheets/campaign/creatives/table/index';
import progresbarStyles from 'stylesheets/campaign/creatives/progressbaroverride';
import Table from '../../../../../components/commons/Table';
import { stringifyJson } from "../../../../../../../isomorphic/utils";
import { isUndefined, isFunction, at } from "@bit/kubric.utils.common.lodash";
import SelectedFilters from "../../../../../components/commons/FilterPanel/selected";
import { campaignStates, isCampaignState } from "../../../../../../../isomorphic/constants/queue";
import { statuses } from "../../../../../../../isomorphic/constants/creatives";
import ProgressBar from '../../../../../components/commons/ProgressBar';
import { getFullDate, convertUTCDateToLocalDate } from '../../../../../lib/date';
import Search from './Search';

const getReadableDataFromUTCString = dateString => getFullDate(convertUTCDateToLocalDate(new Date(dateString)));

const statusMap = {
  'creation-pending': "Fetching Assets",
  'creation-completed': "Created",
  'creation-erred': ({ meta } = {}) => {
    meta = stringifyJson(meta, {});
    const { validationErrors } = meta;
    return isUndefined(validationErrors) ? "Missing Assets" : "Invalid data";
  },
  'publish-pending': "Publish scheduled",
  'publish-inprogress': "Publishing",
  'publish-completed': "Published",
  'publish-erred': "Publish failed",
  'generation-pending': "Queued",
  'generation-inprogress': "Generating",
  'generation-erred': "Generation failed",
  'generation-completed': "Generated"
};

const statusColMap = {
  passed: {
    label: 'Passed',
    icon: 'fonticonCheck',
    class: 'check'
  },
  failed: {
    label: 'Failed',
    icon: 'fonticonError',
    class: 'failed'
  },
  pending: {
    label: 'Pending',
    icon: 'fonticonTasks',
    class: 'pending'
  },
  inprogress: {
    label: 'In Progress',
    icon: 'iconProgress',
    class: 'progress'
  }
};

const QCStatus = ({ status }) => {
  const text = statusColMap[status].label;
  const icon = statusColMap[status].icon;
  return (
    <span className={`${fontIcons[icon]}`}>
      <span/>&nbsp;{text}
    </span>
  )
};

const orgHeaders = (orgData = []) =>
  orgData.map(({ name: displayName } = {}, index) => ({
    displayName,
    data: `source.orgData.${index}.value`,
    id: `orgData_${index}`,
  }));

const attrHeaders = (attributes = []) =>
  attributes.map(({ display_name: displayName } = {}, index) => ({
    displayName,
    data: `source.segment.attributes.${index}.value`,
    id: `attr_${displayName}`,
  }));

const genHeaders = [{
  displayName: 'QC Status',
  data: 'qc_status',
  id: 'qc_status',
  content: qcStatus => (Object.keys(statusColMap).indexOf(qcStatus) > -1) ? <QCStatus status={qcStatus}/> : "--"
}, {
  displayName: 'Copy Approved',
  data: 'manual_copy_qc_status',
  id: 'manual_copy_qc_status',
  theme: {
    cell: styles.manualQc,
    header: styles.manualQc,
  },
  content: status => (isUndefined(status) || status.length === 0) ? "--" :
    <span className={`${fontIcons[status === 'success' ? "fonticonCheck" : "fonticonError"]}`}/>
}, {
  displayName: 'Visual Approved',
  data: 'manual_visual_qc_status',
  id: 'manual_visual_qc_status',
  theme: {
    cell: styles.manualQc,
    header: styles.manualQc,
  },
  content: status => (isUndefined(status) || status.length === 0) ? "--" :
    <span className={`${fontIcons[status === 'success' ? "fonticonCheck" : "fonticonError"]}`}/>
}, {
  displayName: 'Assigned to',
  data: 'assigned_to',
  id: 'assigned_to',
  theme: {
    cell: styles.manualQc,
    header: styles.manualQc,
  },
  content: assignedUser => (isUndefined(assignedUser) || assignedUser.length === 0) ? "--" :
    <span>{assignedUser}</span>
}, {
  displayName: 'Updated on',
  id: 'updated',
  data: 'updated_on',
  editable: false,
  theme: {
    cell: `${styles.dateCell} ${styles.updatedCell}`,
  },
  content: value => getReadableDataFromUTCString(value)
}, {
  displayName: 'Created on',
  id: 'created',
  data: 'created_on',
  editable: false,
  theme: {
    cell: styles.dateCell,
  },
  content: value => getReadableDataFromUTCString(value)
}];

const getTableHeaders = isKubricUser => ([
  {
    displayName: 'No.',
    id: 'sequence',
    content: (data, rowIndex) => <span>{rowIndex + 1}</span>,
    theme: {
      cell: styles.audSequence,
    },
  }, {
    displayName: 'Creatives',
    id: 'creative',
    content: ad => {
      const { status, creativeProgress = 0, unreadChatCount } = ad;
      const [imageUrl] = at(ad, 'content.video.thumbnail');
      let image = <div className={`${fontIcons.fonticonAssets} ${styles.titleIcon}`}/>;
      let defaultImage = true;
      if (!isUndefined(imageUrl)) {
        image = <img className={styles.titleIcon} src={imageUrl}/>;
        defaultImage = false;
      }
      const chatCount = unreadChatCount === true ?
        <span className={styles.dot}/> : (unreadChatCount > 0 ? unreadChatCount : "");

      const inProgress = status === statuses.GENERATION_INPROGRESS;
      const inPending = status === statuses.GENERATION_PENDING;
      const inError = status === statuses.GENERATION_ERRED || status === statuses.CREATION_ERRED;

      if (inProgress || inPending || inError) {
        return (
          <span className={`${styles.audTitleCell} ${styles.uploadingImage}`}>
          {inProgress && <ProgressBar progress={creativeProgress} theme={progresbarStyles} visible={true}/>}
            {inPending && <span className={appIcons.statusIconClock}/>}
            {inError && <span className={appIcons.statusIconCaution}/>}
            {(unreadChatCount > 0 || unreadChatCount === true) ? <div className={styles.chatCount}>{chatCount}</div> :
              <span/>}
        </span>
        )
      } else {
        return (
          <span className={`${styles.audTitleCell} ${defaultImage ? styles.defaultImage : ''}`}>
          {image}
            {(unreadChatCount > 0 || unreadChatCount === true) ? <div className={styles.chatCount}>{chatCount}</div> :
              <span/>}
        </span>
        )
      }
    },
    theme: {
      cell: styles.audTitleCell,
    },
  }, {
    displayName: '',
    id: 'status',
    content: ad => {
      const { status, creativeProgress = 0, updated_on = '' } = ad;
      const statusClass = status.split('-').pop();
      let statusStr = statusMap[status] || '';
      statusStr = isFunction(statusStr) ? statusStr(ad) : statusStr;
      let className = styles[statusClass];
      if (!isKubricUser && status === statuses.CREATION_ERRED) {
        className = "pending";
        statusStr = "Fetching Assets";
      }
      let statusTag = <div className={`${styles.statusBadge} ${className}`}>
        <div className={`${styles.statusText}`}> {statusStr} </div>
      </div>;
      if (status === statuses.GENERATION_INPROGRESS) {
        statusTag = <div className={`${styles.statusBadge} ${className}`}>
          <div className={`${styles.statusText}`}> {`${creativeProgress}% Completed`} </div>
        </div>;
      }
      const [name] = at(ad, 'source.segment.name');
      return (
        <div style={{ width: '100%' }}>
          <div className={styles.audTitle}>{name}</div>
          <div className={styles.statusContainer}>
            {statusTag} <span className={styles.divider}/>{getReadableDataFromUTCString(updated_on)}
          </div>
        </div>
      );
    },
    theme: {
      cell: styles.statusCell,
      header: styles.statusHeader,
    },
  }, ...genHeaders]);

const onSelected = props => (isSelected, { uid: id }, index) => {
  const { onRowSelected, onRowUnselected } = props;
  const callFn = isSelected ? onRowSelected : onRowUnselected;
  callFn && setImmediate(callFn, {
    uid: id,
    id,
    index,
  });
};

const onRowClick = props => ({ uid: id }, index) => {
  const { onClearAndSelect } = props;
  onClearAndSelect && setImmediate(onClearAndSelect, {
    uid: id,
    id,
    index,
  });
};

export default props => {
  const {
    isFilterTab, onLoadNext, completed, loading, loadingNext, tabId, data = {}, filters = {}, onFilterSelected,
    loadingRows = [], campaignStatus, isKubricUser
  } = props;
  const headers = config.creatives.tabs[tabId].headers;
  const { results: creatives = [], selected = [] } = data;
  let extraHeaders = [];
  const isCreationState = isCampaignState(campaignStatus, campaignStates.CREATION);
  if (isCreationState && creatives.length > 0) {
    extraHeaders = !isKubricUser ? orgHeaders(creatives[0].source.orgData) : attrHeaders(creatives[0].source.segment.attributes);
  }
  let headerConfig = [...getTableHeaders(isKubricUser), ...extraHeaders];
  if (headers.length > 0) {
    const headerSet = new Set(headers);
    headerConfig = headerConfig.filter(({ id }) => headerSet.has(id));
  }
  const actions = [<Actions/>, <Search/>];
  isFilterTab && actions.unshift(<SelectedFilters {...filters} onRemove={onFilterSelected} theme={styles}/>);
  return (
    <div>
      {(loading && !loadingNext) ? <Spinner theme={{ overlay: styles.spinnerOverlay }}/> : (
        (isFilterTab && creatives.length === 0) ?
          <div className={styles.noCreatives}>No creatives for the selected filter</div> : (
            <Table theme={styles} headers={headerConfig} data={creatives} scrollable={true} selected={selected}
                   settings={true} onRowClick={onRowClick(props)} onSelected={onSelected(props)} selectable={true}
                   sortable={false} styles={["horborders"]} completed={completed} onLoadNext={onLoadNext}
                   loading={loadingNext} actions={actions} loadingRows={loadingRows}/>
          ))}
    </div>
  );
};