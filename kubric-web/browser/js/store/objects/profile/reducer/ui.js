import types from "../types";
import {
  getDriveAccount,
  getShutterstockAccount,
  updateDriveFolders,
  getPublisherAccount,
  unlinkPublisherNetwork,
  unlinkDrive,
  ingestAssets
} from "../../servicetypes";

const loadingServices = [
  getPublisherAccount,
  unlinkPublisherNetwork,
  unlinkDrive,
  ingestAssets,
  getDriveAccount,
  getShutterstockAccount,
  updateDriveFolders,
];

const isLoadingSet = new Set(loadingServices.map(({ INITIATED }) => INITIATED));
const isLoadingDoneSet = new Set(loadingServices.reduce((acc, { COMPLETED, FAILED }) => {
  acc = [
    ...acc,
    COMPLETED,
    FAILED,
  ];
  return acc;
}, []));

const completedServices = [
  getPublisherAccount,
  getDriveAccount,
  getShutterstockAccount,
];

const isCompletedSet = new Set(completedServices.map(({ COMPLETED }) => COMPLETED));

const updateNetwork = (state, { payload = {} }, patch) => {
  let { network, data = {}, serviceData = {} } = payload;
  network = network || serviceData.network;
  return {
    ...state,
    [network]: {
      ...state[network],
      ...(patch || data),
    },
  };
};

export default (state = {}, action) => {
  if (action.type === types.NETWORK_UI_CHANGE) {
    return updateNetwork(state, action);
  } else if (isCompletedSet.has(action.type)) {
    return updateNetwork(state, action, {
      isLoading: false,
      isCompleted: true,
    });
  } else if (isLoadingSet.has(action.type)) {
    return updateNetwork(state, action, {
      isLoading: true,
    });
  } else if (isLoadingDoneSet.has(action.type)) {
    return updateNetwork(state, action, {
      isLoading: false,
    });
  } else {
    return state;
  }
};

