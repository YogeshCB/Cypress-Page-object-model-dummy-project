import store from '../../index';
import { at } from "@bit/kubric.utils.common.lodash";

const chat = state => (state || store.getState()).chat;

const isChannelConnecting = (channel, state) => at(chat(state), `connectingChannels.${channel}`, false)[0];

const isChannelConnected = (channel, state) => at(chat(state), `connectedChannels.${channel}`, false)[0];

const getChatText = state => at(chat(state), 'text')[0];

const getUserColor = (email, state) => at(chat(state), `usercolors.${email}`, false)[0];

const getCurrentDateBucket = state => at(chat(state), `currentDateBucket`)[0];

const getTagUsers = state => at(chat(state), 'tagUsers')[0];

export default {
  isChannelConnected,
  isChannelConnecting,
  getUserColor,
  getCurrentDateBucket,
  getChatText,
  getTagUsers
};