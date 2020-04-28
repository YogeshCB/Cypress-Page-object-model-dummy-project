import { isValidString } from "@bit/kubric.utils.common.lodash";

const connectionValidators = {
  cloudinary({ cloud_name, api_key, api_secret, user_id } = {}) {
    return isValidString(cloud_name) && isValidString(api_key) && isValidString(api_secret) && isValidString(user_id);
  }
};

const genericValidator = data => !!data;

const resolveNetworks = (labels, { networks, showNetworks = [] }) => showNetworks.reduce((acc, network) => {
  const networkData = networks[network];
  const validator = connectionValidators[network] || genericValidator;
  const isConnected = validator(networkData);
  acc[network] = {
    ...(networkData || {}),
    isConnected,
    headerUI: {
      ...labels[network],
    },
  };
  return acc;
}, {});

export default {
  resolveNetworks,
};