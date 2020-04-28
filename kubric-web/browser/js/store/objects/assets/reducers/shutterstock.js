


import {
    getShutterstockSubscriptions,
    licenseAsset
  } from "../../servicetypes";

export default (types, state = {}, action) => {
    switch (action.type) {
      case types.SELECTED_SUBSCRIPTION:
        return {
          ...state,
          subscription_id: action.payload
        };
      case types.SHOW_LICENSE_MODAL:
        return {
          ...state,
          status: true
        };
      case types.HIDE_LICENSE_MODAL:
        return {
          ...state,
          status: false,
          imageData: undefined,
          completed: false
        };
  
      case getShutterstockSubscriptions.COMPLETED:
        return {
          ...state,
          subscriptions: action.payload.response.data,
          loading: false
        };
      case getShutterstockSubscriptions.INITIATED:
        return {
          ...state,
          loading: true
        };
  
      case licenseAsset.INITIATED:
        return {
          ...state,
          imageData: undefined,
          loading: true
        };
      case licenseAsset.COMPLETED:
        return {
          ...state,
          completed: true,
          imageData: action.payload.response.data,
          loading: false,
          subscriptions: [],
          subscription_id: undefined
        };
      default:
        return state;
    }
  };