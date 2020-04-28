import listFactory from "@bit/kubric.redux.packs.list";
import store from "../../../index";
import { at } from "@bit/kubric.utils.common.lodash";
import { fetchImageBank } from "../../servicetypes";
import sourcingTypes from "../../../objects/sourcing/types";
import services from "../../../../services";

const LIST_NAME = "sourcing";

export default listFactory(LIST_NAME, {
	idField: "id",
	service: {
		method: services.sourcing.getImageBank(),
		data: "response",
		types: fetchImageBank
	},
	types: {
		fetched: {
			[sourcingTypes.GET_IMAGE_BANK]: {
				paging: "next",
				data: "data"
			}
		}
	},
	isCompleted(data, limit, next) {
		return typeof next === "undefined";
	},
	getListState() {
		return at(store.getState(), `sourcing.data`)[0];
	}
	// types: {
	// 	fetched: {
	// 		[sourcingTypes.GET_IMAGE_BANK]: {
	// 			data: "data"
	// 		}
	// 	}
	// }
});
