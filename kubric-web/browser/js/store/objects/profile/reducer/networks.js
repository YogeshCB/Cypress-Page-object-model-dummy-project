import { at } from "@bit/kubric.utils.common.lodash";
import { indexBy } from "@bit/kubric.redux.state.utils";
import types from '../types';
import {
  getProfile,
  getPublisherAccount,
  getDriveAccount,
  getShutterstockAccount,
  updateDriveFolders,
  ingestAssets
} from "../../servicetypes";
import userSelectors from '../../user/selectors';


const updateNetwork = (state, { payload = {} } = {}, patch) => {
  let { network, serviceData = {}, data = {} } = payload;
  network = network || serviceData.network;
  if (network) {
    return ({
      ...state,
      [network]: {
        ...state[network],
        ...(patch || data),
      },
    });
  } else {
    return state;
  }
};

export default (state = {}, action) => {
  switch (action.type) {
    case getProfile.COMPLETED:
    case types.PROFILE_FETCHED: {
      const payload = action.payload.response || action.payload;
      const workspace = userSelectors.getWorkspaceId();
      const adNetworks = at(payload, `company_profile.${workspace}.adnetworks`, [])[0];
      const assetNetworks  = at(payload, `company_profile.${workspace}.assetnetworks`, [])[0]
      return indexBy([
        ...adNetworks,
        ...assetNetworks
      ], {
        merge: state,
      });
    }
    case types.INTEGRATIONS_FETCHED: {
      const assetIntegrations = [];
      Object.keys(action.payload).map(key=>{
        if(action.payload[key] !== null && Object.keys(action.payload[key]).length !==0) {
          assetIntegrations.push({
            ...action.payload[key],
            id: key,
            isConnected: true,
            ui: action.payload[key]
          })
        }
      })
      return indexBy([
        ...assetIntegrations
      ], {
        merge: state,
      });
    }
    case types.NETWORK_SETTING_CHANGE:
      return updateNetwork(state, action);
    case getPublisherAccount.COMPLETED: {
      const { adaccounts = {}, businesses = {} } = action.payload.response;
      return updateNetwork(state, action, {
        adaccounts: adaccounts.data,
        businesses: businesses.data,
      });
    }
    case ingestAssets.COMPLETED:
      return updateNetwork(state, action, {
        connected: true
      });
    case updateDriveFolders.COMPLETED:
    case getShutterstockAccount.COMPLETED:
    case getDriveAccount.COMPLETED:
      return updateNetwork(state, action, action.payload.response);
    default:
      return state;
  }
};
