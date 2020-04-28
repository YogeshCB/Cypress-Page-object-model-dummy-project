import userTypes from "./types";
import { deleteWorkspace, setWorkspace } from "../servicetypes";

export default (state = {}, action) => {
  switch (action.type) {
    case userTypes.USER_FETCHED:
      return {
        ...action.payload,
      };
    case setWorkspace.COMPLETED:
      return {
        ...state,
        workspace_id: action.payload.response.workspace_id
      };
    case deleteWorkspace.COMPLETED:
      return {
        ...state,
        workspace_id: undefined
      };
    default:
      return state;
  }
};
