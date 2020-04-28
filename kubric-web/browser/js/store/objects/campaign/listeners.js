import FirebaseQueue from "../../../lib/fbqueue";
import ssActions from "./ssupload/actions";
import store from '../../../store';
import { CREATED_CAMPAIGN_ROUTE, CAMPAIGN_SB_ROUTE } from "../../../routes";
import { wfStatus as statuses } from '@bit/kubric.queue.firebase.constants'
import routeSelectors from "../route/selectors";
import campaignSelectors from "../campaign/selectors";
import campaignTypes from "../campaign/types";
import creativesActions from "../campaign/creatives/actions";
import creativesTypes from "../campaign/creatives/types";
import { redirect } from "@bit/kubric.utils.common.router";
import { getCampaignCreativesUrl } from "../../../lib/links";
import creativesListPack from "./creatives/list";
import rtManager from "../../../lib/rtmanager";
import { Firebase } from "../../../lib/firebase";
import config from "../../../config";
import routeTypes from "../route/types";
import Resolver from '@bit/kubric.utils.common.json-resolver';
import { isUndefined } from "@bit/kubric.utils.common.lodash/index";
import { statuses as creativeStatuses } from "../../../../../isomorphic/constants/creatives";
import { throttler } from "../../../store";
import { campaignStates, isCampaignState } from "../../../../../isomorphic/constants/queue";
import { generationStatuses } from "../../../../../isomorphic/constants/creatives";
import { assettaskworker } from "../../../workers/listeners";
import { setWorkspace } from "../servicetypes";

const resolver = new Resolver();
const completedCreatives = {};

export const listenToSpreadsheetJob = jobId => FirebaseQueue.setTaskListener('adcreation', jobId, taskData => {
  const { _progressStats: stats = {}, __wfstatus__: wfStatus } = taskData;
  const { done, totalCount } = stats;
  const progress = parseInt(done / totalCount * 100);
  progress > 0 && store.dispatch(ssActions.adCreationProgressed({
    progress: 30 + parseInt(done / totalCount * 70),
    message: "Processing uploaded CSV"
  }));
  const currentRoute = routeSelectors.getRouteId();
  if (wfStatus === statuses.COMPLETED && (currentRoute === CREATED_CAMPAIGN_ROUTE || currentRoute === CAMPAIGN_SB_ROUTE)) {
    const campaignId = campaignSelectors.getCampaignId();
    store.dispatch(ssActions.closeUpload(0));
    store.dispatch(creativesListPack.actions.purgeList());
    redirect(getCampaignCreativesUrl(campaignId));
  } else if (wfStatus === statuses.ERRED) {
    store.dispatch(ssActions.adCreationProgressed({
      progress: 0,
      hasErred: true
    }));
  }
});

const shouldUpdateCreative = (uid, patch) => {
  const creative = creativesListPack.selectors.getById(uid);
  if (Object.keys(patch).length > 0) {
    if (!isUndefined(creative)) {
      const fields = Object.keys(patch);
      const current = fields.reduce((acc, field) => {
        acc[field] = creative[field];
        return acc;
      }, {});
      const shouldUpdate = Object.keys(patch).length > 0 && (JSON.stringify(current) !== JSON.stringify(patch));
      return {
        addToBuffer: shouldUpdate,
        shouldUpdateRow: shouldUpdate
      };
    } else {
      return {
        addToBuffer: true,
        shouldUpdateRow: false
      };
    }
  } else {
    return {
      addToBuffer: false,
      shouldUpdateRow: false
    };
  }
};

const getCreativePatch = doc => {
  const data = doc.data();
  const { status = "", creative: creativeData = {} } = data;
  const { creativeId, progress: creativeProgress = 0, thumbnailURL: thumbnail, videoURL: url, watermarkURL: watermarkUrl, status: generationStatus } = creativeData || {};
  const creativePatch = {};
  //Add status to the patch
  status.length > 0 && (creativePatch.status = status);

  //Consider creative progress updates only if the status received is a generation based status
  if (isCampaignState(status, campaignStates.GENERATION)) {

    //Creative progress updates are required only if the creative is not already marked as completed
    if (!completedCreatives[creativeId]) {

      //If the creative progress is > 0, it means that either the creative has completed or is in progress
      if (creativeProgress > 0) {
        creativePatch.creativeProgress = creativeProgress;

        //creative has completed generation
        if (generationStatus === generationStatuses.COMPLETED && !isUndefined(url)) {
          //forcing creative status as "generation-completed"
          creativePatch.status = creativeStatuses.GENERATION_COMPLETED;
          completedCreatives[creativeId] = true;
          creativePatch.content = {
            video: {
              thumbnail,
              url,
              watermarkUrl
            }
          };
        }
      } else if (generationStatus === generationStatuses.FAILED) {
        completedCreatives[creativeId] = true;
        //forcing creative status as "generation-erred"
        creativePatch.status = creativeStatuses.GENERATION_ERRED;
      }
    } else {
      //If the creative is already marked as completed, no more further generation based status updates are required
      //for that creative
      delete creativePatch.status;
    }
  }
  return creativePatch;
};

const listenCampaign = ({ type, payload }) => {
  if (type === routeTypes.ROUTE_LOADED && payload.routeId !== CREATED_CAMPAIGN_ROUTE) {
    return;
  }
  const campaignId = campaignSelectors.getCampaignId();
  throttler.enable([creativesListPack.types.ROW_CHANGE, creativesTypes.UPDATE_PROGRESS_BUFFER]);
  return Firebase.init()
    .then(firebase => {
      const db = firebase.firestore();
      const unsubscribe = db.collection(resolver.resolve(config.paths.firestore.campaignAds, {
          campaign: campaignId,
        }))
        .onSnapshot(snap => {
          let buffer = {};
          snap.forEach(doc => {
            const uid = doc.ref.id;
            const creativePatch = getCreativePatch(doc);
            const { shouldUpdateRow, addToBuffer } = shouldUpdateCreative(uid, creativePatch);
            if (shouldUpdateRow) {
              store.dispatch(creativesListPack.actions.rowChange({
                id: uid,
                data: creativePatch
              }));
            }
            if (addToBuffer) {
              buffer = {
                ...buffer,
                [uid]: creativePatch
              };
            }
          });
          Object.keys(buffer).length > 0 && store.dispatch(creativesActions.updateProgressBuffer(buffer));
        });
      return {
        types: [routeTypes.ROUTE_LOADED],
        handler: () => {
          unsubscribe();
          throttler.disable();
        }
      };
    });
  // }
};

rtManager.registerListener([routeTypes.ROUTE_LOADED, campaignTypes.CREATIVES_LOADED], listenCampaign);
rtManager.registerListener([routeTypes.ROUTE_LOADED, setWorkspace.COMPLETED], assettaskworker);