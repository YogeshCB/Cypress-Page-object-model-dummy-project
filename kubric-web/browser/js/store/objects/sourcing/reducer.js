import { combineReducers } from "redux";
import sourcingListPack from "../lists/sourcing";
import flagReducer from "@bit/kubric.redux.reducers.flag";
import { fetchImageBank } from "../servicetypes";
import sourcingTypes from "./types";

const page = (state = 0, action) => {
	switch (action.type) {
		case sourcingTypes.NEXT_PAGE:
			return state + 1;
		case sourcingTypes.PREVIOUS_PAGE:
			if (state > 0) return state - 1;
		case sourcingTypes.SELECT_PAGE:
			return action.payload;
		case sourcingTypes.UPDATE_RANGE:
			return 0;
		default:
			return state;
	}
};

const range = (state = { min: 0, max: 1 }, action) => {
	switch (action.type) {
		case sourcingTypes.UPDATE_RANGE:
			return action.payload;
		default:
			return state;
	}
};

export default combineReducers({
	data: sourcingListPack.reducer,
	page: page,
	range: range,
	...flagReducer("loading", {
		on: [fetchImageBank.INITIATED, fetchImageBank.INITIATED],
		off: [fetchImageBank.COMPLETED, fetchImageBank.COMPLETED]
	})
});
