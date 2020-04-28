import rtManager from '../../../../lib/rtmanager';
import routeTypes from '../../../../store/objects/route/types';
import {
  rejectCopyQC,
  approveCopyQC,
  setWorkspace,
  rejectVisualQC,
  approveVisualQC,
} from "../../servicetypes";
import routeSelectors from "../../route/selectors";
import { CREATED_CAMPAIGN_ROUTE } from "../../../../routes";
import campaignSelectors from "../selectors";
import FirebaseQueue from '../../../../lib/fbqueue';
import { isUndefined, isNull } from "@bit/kubric.utils.common.lodash";
import { wfStatus } from '@bit/kubric.queue.firebase.constants'
import creativesListPack from "../../../../store/objects/campaign/creatives/list";
import store from '../../../../store';

const setupFirebaseListeners = taskId => {
  const doneRef = FirebaseQueue.getTaskRef('manualqc', taskId, "_progressStats/done");
  const doneHandler = snap => {
    const creative = snap.val();
    setImmediate(() => store.dispatch(creativesListPack.actions.replaceRow({
      old: creative.uid,
      new: creative
    })));
  };
  FirebaseQueue.getTaskRef('manualqc', taskId)
    .once("value", snap => {
      const value = snap.val();
      if (!isNull(value)) {
        const { __wfstatus__: status } = value;
        if (status !== wfStatus.COMPLETED && status !== wfStatus.ERRED) {
          doneRef.on("child_added", doneHandler);
        }
      }
    });
  return {
    ref: doneRef,
    handler: doneHandler
  };
};

const listenManualQCTasks = action => {
  const routeId = routeSelectors.getRouteId();
  const { manualCopyQC: copytaskId, manualVisualQC: visualTaskId } = campaignSelectors.getTasks() || {};
  if (routeId === CREATED_CAMPAIGN_ROUTE) {
    const handlers = [];
    !isUndefined(copytaskId) && handlers.push(setupFirebaseListeners(copytaskId));
    !isUndefined(visualTaskId) && handlers.push(setupFirebaseListeners(visualTaskId));
    return {
      types: [setWorkspace.INITIATED, routeTypes.ROUTE_LOADED],
      handler: () => handlers.forEach(({ ref, handler }) => ref.off('child_added', handler))
    };
  }
};

rtManager.registerListener([
  routeTypes.ROUTE_LOADED,
  rejectCopyQC.COMPLETED,
  approveCopyQC.COMPLETED,
  rejectVisualQC.COMPLETED,
  approveVisualQC.COMPLETED,
], listenManualQCTasks);