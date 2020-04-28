import playerFactory from "../../commons/player";
import { at } from "@bit/kubric.utils.common.lodash";

export default playerFactory("bulkedit", {
  getState() {
    const { default: store } = require("../../../../store");
    return at(store.getState(), 'campaign.bulkEdit.player')[0];
  }
});