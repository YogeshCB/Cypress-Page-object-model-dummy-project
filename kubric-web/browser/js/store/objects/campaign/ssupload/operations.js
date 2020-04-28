import actions from './actions';
import services from "../../../../services";
import campaignSelectors from '../selectors';
import notificationActions from "../../notifications/actions";
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import { isValidString } from "@bit/kubric.utils.common.lodash";
import store from "../../../index";
import userSelectors from "../../user/selectors";
import campaignActions from "../actions";
import routeSelectors from "../../route/selectors";
import { CAMPAIGN_SB_ROUTE } from "../../../../routes";
import { isKubricUser } from "../../../../lib/utils";
import SSUploader from "../../../../services/ssuploader";
import { getSelectedStoryboards } from "./utils";

const onOpenUpload = () => dispatch => {
  const storyboards = campaignSelectors.getSelectedStoryboardIds();
  const campaignId = campaignSelectors.getCampaignId();
  if ((!storyboards || storyboards.length === 0) && !isValidString(campaignId)) {
    dispatch(notificationActions.addNotification({
      type: 'error',
      heading: 'Select Storyboard',
      desc: 'Please select a storyboard for generating creatives',
    }));
  } else {
    dispatch(actions.openUpload());
  }
};

const onCSVFileSelected = files => dispatch => {
  const storyboards = getSelectedStoryboards();
  const id = campaignSelectors.getCampaignId();
  const routeId = routeSelectors.getRouteId();
  const preprocess = !isKubricUser(userSelectors.getUserEmail());
  const uid = userSelectors.getUserId();
  const uploadCSV = serviceData => {
    store.dispatch(actions.adCreationProgressed({
      progress: 5,
      message: "Uploading CSV"
    }));
    SSUploader.getInstance()
      .then(ssuploader => {
        ssuploader.upload(files.files, {
          ...serviceData,
          preprocess,
          uid
        });
      });
  };

  //If coming from creation
  if (routeId === CAMPAIGN_SB_ROUTE) {
    store.dispatch(actions.adCreationProgressed({
      progress: 0,
      message: "Setting up campaign"
    }));
    services.campaign
      .create()
      .notifyStore()
      .send({
        name: campaignSelectors.getCampaignName(),
        mediaFormat: campaignSelectors.getMediaFormat(),
        storyboards
      })
      .then(campaign => {
        const { uid: id } = campaign;
        dispatch(campaignActions.campaignFetched(campaign));
        uploadCSV({
          id
        });
      });
  } else {
    uploadCSV({
      id
    });
  }
};

export default {
  ...getOperations(actions),
  onOpenUpload,
  onCSVFileSelected
};