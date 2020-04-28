export const isCampaignState = (status, state) => (new RegExp(`^${state}`)).test(status);

export const campaignStates = {
  CREATION: "creation-",
  ADCREATION: "adcreation-",
  GENERATION: "generation-",
  PUBLISH: "publish-",
};

export const campaignStatus = {
  UPDATING_ADS: 'updating-ads',
  CREATION_PENDING: "creation-pending",
  CREATION_COMPLETED: "creation-completed",
  CREATION_ERRED: "creation-erred",
  ADCREATION_PENDING: "adcreation-pending",
  ADCREATION_INPROGRESS: "adcreation-inprogress",
  ADCREATION_COMPLETED: "adcreation-completed",
  ADCREATION_ERRED: "adcreation-erred",
  GENERATION_PENDING: "generation-pending",
  GENERATION_INPROGRESS: "generation-inprogress",
  GENERATION_COMPLETED: "generation-completed",
  GENERATION_ERRED: "generation-erred",
  PUBLISH_PENDING: "publish-pending",
  PUBLISH_INPROGRESS: "publish-inprogress",
  PUBLISH_COMPLETED: "publish-completed",
  PUBLISH_ERRED: "publish-erred",
};