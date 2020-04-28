import creativesListPack from "../creatives/list";
import { at } from "@bit/kubric.utils.common.lodash";
import campaignSelectors from "../selectors";
import parametersPack from "./parameters";
import store from "../../../../store";
import playerPack from "./player";
import creativesSelectors from "../creatives/selectors";

const bulkEdit = state => (state || store.getState()).campaign.bulkEdit;

const getShots = state => {
  const currentCreative = getCurrentCreative(state);
  const [bindingIndex] = at(creativesListPack.selectors.getSelectedRows(), `${currentCreative}.source.bindingIndex`, 0);
  return campaignSelectors.getShots(bindingIndex);
};

const getBindings = state => {
  const [bindingIndex] = at(creativesListPack.selectors.getSelectedRows(), `0.source.bindingIndex`, 0);
  return campaignSelectors.getBindings(bindingIndex);
};

const getEditorMeta = state => at(creativesListPack.selectors.getSelectedRows(), `0.meta`, '{}')[0];

const getCurrentCreative = state => bulkEdit(state).currentCreative;

const currentCreative = state => at(creativesListPack.selectors.getSelectedRows(), `${getCurrentCreative(state)}`)[0];

const getCurrentCreativeParameters = state => at(currentCreative(state), `source.parameters`)[0];

const getCurrentCreativeName = state => at(currentCreative(state), `source.segment.name`)[0];

const nextEnabled = state => {
  const { currentCreative } = bulkEdit(state);
  const maxIndex = creativesSelectors.getSelectedRowsCount() - 1;
  return currentCreative < maxIndex;
};

const previousEnabled = state => {
  const { currentCreative } = bulkEdit(state);
  return currentCreative > 0;
};

export default {
  getShots,
  getEditorMeta,
  getBindings,
  getCurrentCreative,
  getCurrentCreativeParameters,
  getCurrentCreativeName,
  nextEnabled,
  previousEnabled,
  ...parametersPack.selectors,
  ...playerPack.selectors
};