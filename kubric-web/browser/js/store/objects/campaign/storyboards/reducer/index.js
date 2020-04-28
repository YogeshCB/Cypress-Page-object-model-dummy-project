import { combineReducers } from "redux";
import listPack from "./list";

export default combineReducers({
  data: listPack.reducer
});