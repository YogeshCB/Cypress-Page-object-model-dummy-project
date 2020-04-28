import types from "../types";
import { profileUpload, getProfile } from "../../servicetypes";

export default (state = {}, action) => {
  switch (action.type) {
    case types.PROFILE_DATA_CHANGED:
      return {
        ...state,
        ...action.payload,
      };
    case getProfile.COMPLETED:
      return {
        ...action.payload.response,
      };
    case types.PROFILE_FETCHED:
      return {
        ...action.payload,
      };
    case profileUpload.UPLOAD_COMPLETED:
      return {
        ...state,
        profile_image_url: action.payload.response.url,
      };
    case profileUpload.UPLOAD_INITIATED:
      return {
        ...state,
        uploadJob: action.payload.extraData.__key__,
      };
    default:
      return state;
  }
};

