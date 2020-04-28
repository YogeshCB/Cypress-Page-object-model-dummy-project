import store from '../../../store';

const messages = state => (state || store.getState()).messages;

const isSetup = state => messages(state).isSetup;

const subscriptions = state => messages(state).subscriptions;

const getNotificationConfig = state => messages(state).config;

const getNotifications = state => messages(state).notifications;

const isPreferenceVisible = state => messages(state).isPreferenceVisible;

export default {
  isSetup,
  isPreferenceVisible,
  subscriptions,
  getNotificationConfig,
  getNotifications
};
