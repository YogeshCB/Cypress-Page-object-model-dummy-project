import store from '../../../index';
import campaignSelectors from "../selectors";
import playerPack from './player';
import parametersPack from './parameters';

const creative = state => (state || store.getState()).campaign.creative;

const getName = state => creative(state).name;

const getCreativeId = state => creative(state).id;

const getSource = state => creative(state).source;

const getCurrentEditorShot = parametersPack.selectors.getSelectedShot;

const getBindingIndex = state => creative(state).bindingIndex;

const getBindings = state => {
  const bindingIndex = getBindingIndex(state);
  return campaignSelectors.getBindings(bindingIndex);
};

const getShots = state => {
  const bindingIndex = getBindingIndex(state);
  return campaignSelectors.getShots(bindingIndex);
};

const getEditorMeta = state => creative(state).meta.editorMeta && creative(state).meta.editorMeta[getCurrentEditorShot(state)];

export default {
  creative,
  getName,
  getEditorMeta,
  getBindings,
  getSource,
  getCreativeId,
  getShots,
  ...playerPack.selectors,
  getCurrentEditorShot,
  getParameters: parametersPack.selectors.getParameters,
  getCurrentParameters: parametersPack.selectors.getCurrentParameters,
  getCurrentLoadingParameters: parametersPack.selectors.getLoadingParameters,
};