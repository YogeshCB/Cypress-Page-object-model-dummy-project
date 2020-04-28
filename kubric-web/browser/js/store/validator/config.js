import { isValidString } from "@bit/kubric.utils.common.lodash";

const campaignValidator = ({ campaignType, campaignName, campaignObjective, campaign }, errorObj) => {
  if (campaignType === 'new') {
    !isValidString(campaignName) && errorObj.postError('campaignName', 'required');
    !isValidString(campaignObjective) && errorObj.postError('campaignObjective', 'required');
  } else if (campaignType === 'existing' && (typeof campaign === 'undefined' || campaign.length === 0)) {
    errorObj.postError('campaign', 'required');
  }
};

export default {
  profile: {
    required: {
      name: true,
      phone_no: true,
      desc: true,
      email: true,
    },
    number: {
      phone_no: true,
    },
  },
  publisherPage1: {
    _custom: [campaignValidator],
    required: {
      page: true,
      adTitle: true,
      adSetName: true,
      link: true,
      channels: (data = '', postError) => !isValidString(data) && postError('At least one publish channel should be selected')
    },
  },
  publisherPage2: {
    required: {
      adText: true,
      cta: true
    },
  },
};
