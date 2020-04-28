import actions from './actions';
import campaignOperations from "../campaign/operations";
import publisherActions from "./actions";
import publisherSelectors from "./selectors";
import { formErrorActions } from "./actions";
import { getIndexUrl } from "../../../lib/links";
import { redirect } from "@bit/kubric.utils.common.router";
import { validate as formValidator } from '../../validator';
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import services from '../../../services';

const onPublisherFieldChange = (name, value) => dispatch => dispatch(actions.publisherFieldChange({
  [name]: value,
}));

const onPublisherSelectboxChange = (value, name, data) => dispatch => dispatch(actions.publisherFieldChange({
  [name]: data,
}));

const onPublisherChannelChange = (checked, value) =>
  dispatch => dispatch(checked ? actions.publisherChannelAdded(value) : actions.publisherChannelRemoved(value));

const onCampaignSelected = value => dispatch => {
  dispatch(actions.publisherFieldChange({
    campaignName: value.data.name,
    campaign: value.data.id,
  }));
  dispatch(actions.publisherFieldSelected({
    campaign: value,
  }));
};

const onCampaignUnselected = () => dispatch => {
  dispatch(actions.publisherFieldChange({
    campaignName: undefined,
    campaign: undefined,
  }));
  dispatch(actions.publisherFieldUnselected({
    campaign: undefined,
  }));
};

const onHideAdPublishModal = () => dispatch => dispatch(actions.hidePublisher());

const getAdData = () => ({
  ...publisherSelectors.getPublisherData(),
});

const onNextPage = () => dispatch => {
  const pageNumber = publisherSelectors.getCurrentPageNumber();
  const adData = getAdData();
  if (pageNumber === 0) {
    const results = formValidator('publisherPage1', adData);
    if (!results.errors) {
      dispatch(publisherActions.setPage(1));
    } else {
      dispatch(formErrorActions.setFormErrors(results.errors));
    }
  } else if (pageNumber === 1) {
    const results = formValidator('publisherPage2', adData);
    if (!results.errors) {
      campaignOperations.onSave()
        .then(({ uid: campaignId }) =>
          services.campaignpublisher.publishCampaignAds()
            .notifyStore()
            .send({
              campaignId,
            })
            .then(() => {
              publisherActions.hidePublisher();
              redirect(getIndexUrl());
            }));
    } else {
      dispatch(formErrorActions.setFormErrors(results.errors));
    }
  }
};

const onPreviousPage = () => dispatch => {
  const pageNumber = publisherSelectors.getCurrentPageNumber();
  if (pageNumber === 1) {
    dispatch(publisherActions.setPage(0));
  }
};

export default {
  ...getOperations(formErrorActions, {
    onClearFormError: formErrorActions.clearFormError,
  }),
  onPublisherChannelChange,
  onNextPage,
  onPreviousPage,
  onHideAdPublishModal,
  onPublisherFieldChange,
  onCampaignSelected,
  onCampaignUnselected,
  onPublisherSelectboxChange,
};
