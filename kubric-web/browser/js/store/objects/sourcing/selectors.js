import store from "../../index";

const sourcing = state => (state || store.getState()).sourcing;

const getLoading = state => sourcing(state).loading;

const getPage = state => sourcing(state).page;

const getRange = state => sourcing(state).range;

export default {
	sourcing,
	getLoading,
	getPage,
	getRange
};
