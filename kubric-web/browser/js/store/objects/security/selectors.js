import store from "../../../store";

const security = state => (state || store.getState()).security;

const getAudits = state => security(state).audits;

export default {
	getAudits
};
