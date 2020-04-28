import playerFactory from "../../commons/player";
import { at } from "@bit/kubric.utils.common.lodash";

export default playerFactory("creative", {
  getState() {
    const { default: store } = require("../../../../store");
    return at(store.getState(), 'campaign.creative.player')[0];
  }
});