import types from "./types";
import { combineReducers } from "redux";

const initialState = [];

const auditsReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.AUDITS_FETCHED:
			return action.payload.data;
		default:
			return state;
	}
};

export default combineReducers({
	audits: auditsReducer
});
