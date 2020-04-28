import store from '../../../store';

const picker = state => (state || store.getState()).picker;

const config = state => picker(state).config;

const isPickerOpen = state => picker(state).open;

const getSelectedNetwork = (state) => config(state).network;

const getFilterStatus = (state) => picker(state).showFilter;

const isLoading = state => picker(state).loading;

const getCallback = (state) => config(state).callback;

export default {
  getState: picker,
  getPickerConfig: config,
  isPickerOpen,
  isLoading,
  getSelectedNetwork,
  getCallback,
  getFilterStatus
};
