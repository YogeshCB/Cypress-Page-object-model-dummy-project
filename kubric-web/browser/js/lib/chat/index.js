import { isUndefined, isFunction, isNull, isValidString, at } from "@bit/kubric.utils.common.lodash";
import services from '../../services';
import { stringToHslColor } from "../colors";
import Resolver from '@bit/kubric.utils.common.json-resolver';
import config from '../../config';
import { errors } from "./constants";
import Queue from "../queue";
import { formatMessages } from "../../store/objects/chat/formatter";
import { getCreativeChatSettings } from "../../../../isomorphic/utils";

const resolver = new Resolver();
const channelKeys = config.chat.channels;

export default class Chat {
  static instance;
  static userColorCache = {};
  static channelTypes = {
    CREATIVE: 'creative'
  };
  static initialized = false;

  static getInstance() {
    if (isUndefined(Chat.instance)) {
      Chat.instance = new Chat();
    }
    return Chat.instance;
  }

  static getUserColor(user = {}) {
    const { name = '', email = '' } = user;
    const key = `${name}_${email}`;
    let color = Chat.userColorCache[key];
    if (isUndefined(color)) {
      color = stringToHslColor(key);
    }
    Chat.userColorCache[key] = color;
    return color;
  }

  static loadNextMessages(transformer, { messageIndex } = {}) {
    const instance = Chat.getInstance();
    return instance.getMessages({
        messageIndex
      })
      .then(response => isFunction(transformer) ? transformer(response) : response);
  }

  constructor() {
    this.channels = {};
    this.messageQueue = new Queue();
    this.channelQueue = new Queue({
      maxWorkers: 3
    });
    this.channelQueue.registerWorker(::this._setupChannelTaskHandler);
    this.messageQueue.registerWorker(::this._sendMessageTaskHandler);
  }

  setToken(token, isRefresh = true) {
    this.token = token;
    if (isRefresh) {
      this.accessManager.updateToken(token);
    }
  }

  async generateToken(isRefresh) {
    const { token } = await services.chat.generateToken().send();
    this.setToken(token, isRefresh);
    return token;
  }

  updateClientToken(accessManager) {
    this.client.updateToken(accessManager.token);
  }

  async init() {
    if (!Chat.initialized) {
      const [{ default: Twilio }, { AccessManager }] = await Promise.all([
        import(/* webpackChunkName: "twilio" */ 'twilio-chat'),
        import(/* webpackChunkName: "twilio" */ 'twilio-common')
      ]);
      const token = await this.generateToken(false);
      this.client = await Twilio.create(token);
      this.accessManager = new AccessManager(token);
      this.accessManager.on('tokenExpired', ::this.refreshToken);
      this.accessManager.on('tokenUpdated', ::this.updateClientToken);
      Chat.initialized = true;
    }
  }

  async refreshToken() {
    await this.generateToken();
  }

  static getChannelId(channelType, id) {
    return resolver.resolve(channelKeys[channelType], {
      id
    });
  }

  async setActiveChannel(channelId, sid) {
    if (this.channels[channelId]) {
      this.activeChannel = this.channels[channelId];
    } else {
      this.activeChannel = await this.fetchChannel(sid, channelId);
    }
    return this.activeChannel;
  }

  async fetchChannel(sid, channelId) {
    try {
      const channel = await this.client.getChannelBySid(sid);
      if (!isUndefined(channelId)) {
        this.channels[channelId] = channel;
      }
      return channel;
    } catch (ex) {
      throw {
        code: errors.MISSING_CHANNEL
      };
    }
  }

  async getUnreadMessagesCount({ sid, channelId, email, channel, tryToJoin = false }) {
    if (!channel) {
      channel = await this.fetchChannel(sid, channelId);
    }
    if (tryToJoin) {
      await this.join(channel);
    }
    const members = await channel.getMembers();
    const [currentMember] = members.filter(({ identity }) => identity === email);
    const lastConsumedMessageIndex = currentMember.lastConsumedMessageIndex;
    const totalMessages = await channel.getMessagesCount();
    const unreadCount = isNull(lastConsumedMessageIndex) ? totalMessages : Math.max(totalMessages - lastConsumedMessageIndex - 1, 0);
    const [mentionCount] = at(currentMember, 'state.attributes.mentions', 0);
    return {
      unreadCount,
      mentionCount
    };
  }

  getChannel(channelId) {
    return this.channels[channelId];
  }

  async _onChannelCreated({ channelSid, channel }) {
    try {
      if (!channel) {
        channel = await this.client.getChannelBySid(channelSid);
      }
      this.join(channel);
      const messages = await this.getMessages({ channel });
      const { messages: formattedMessages } = formatMessages(messages);
      return {
        channel,
        channelSid,
        messages: formattedMessages
      }
    } catch (ex) {
      console.error(ex);
      throw {
        code: errors.MISSING_CHANNEL
      };
    }
  }

  createChannel(channelData) {
    return services.chat.setupChannel()
      .send(channelData)
      .then(::this._onChannelCreated);
  }

  async _setupChannelTaskHandler(data, resolve, reject) {
    const { creative, name, channelId } = data;
    const chatSettings = getCreativeChatSettings(creative);
    const createChannel = async () => {
      const { channel, ...response } = await this.createChannel({
        name,
        id: channelId
      });
      this.channels[channelId] = channel;
      resolve({
        ...response,
        channel,
        created: true
      });
    };
    if (isUndefined(chatSettings) || !isValidString(chatSettings.channelSid)) {
      createChannel();
    } else {
      try {
        const { channelSid } = chatSettings;
        const data = await this._onChannelCreated({
          channelSid
        });
        resolve({
          ...data,
          created: false
        })
      } catch (ex) {
        if (ex.code === errors.MISSING_CHANNEL) {
          createChannel();
        }
      }
    }
  }

  setupChannel(data = {}) {
    const { creative, name } = data;
    if (isUndefined(creative) || isUndefined(name)) {
      throw {
        code: errors.MISSING_CHANNEL_PARAMETERS
      };
    } else {
      const { uid: id } = creative;
      const channelId = Chat.getChannelId(Chat.channelTypes.CREATIVE, id);
      const channelObject = this.channels[channelId];
      if (isUndefined(channelObject)) {
        //If channelObject is undefined, it means that the channel needs to be created/retrieved
        const channelId = Chat.getChannelId('creative', creative.uid);
        this.channels[channelId] = this.channelQueue.add({
          ...data,
          channelId
        });
        return this.channels[channelId];
      } else if (isFunction(channelObject.then)) {
        //If channelObject is a promise, it means that there is already a channel creation in progress
        return channelObject;
      } else {
        //If it is an object, then it means that the channel is already init
        const chatSettings = getCreativeChatSettings(creative);
        const { channelSid } = chatSettings;
        return this._onChannelCreated({
            channelSid,
            channel: this.channels[channelId]
          })
          .then(response => ({
            ...response,
            created: false
          }));
      }
    }
  }

  async _sendMessageTaskHandler({ channelId, text, user, parts }, resolve, reject) {
    let channel = this.channels[channelId];
    if (isFunction(channel.then)) {
      const results = await channel;
      channel = results.channel;
    }
    const message = await channel.sendMessage(text, {
      user,
      parts
    });
    resolve(message);
  }

  sendMessage({ creative, text, user = {}, parts = [] }) {
    if (isUndefined(creative) || !isValidString(user.email)) {
      throw {
        code: errors.MISSING_MESSAGE_PARAMETERS
      }
    }
    const { uid: id } = creative;
    const channelId = Chat.getChannelId('creative', id);
    return this.messageQueue.add({
      channelId,
      text,
      user,
      parts
    });
  }

  getMessages({ limit = 50, messageIndex, channel } = {}) {
    channel = channel || this.activeChannel;
    if (!channel) {
      throw {
        code: errors.NO_CHANNEL_PROVIDED
      };
    }
    return channel.getMessages(limit, messageIndex);
  }

  async getLastMessage(channel) {
    channel = channel || this.activeChannel;
    const { items = [] } = await this.getMessages({
      channel,
      limit: 1
    });
    return items[0];
  }

  join(channel) {
    channel = channel || this.activeChannel;
    return new Promise((resolve, reject) => {
      this.client.on('channelJoined', resolve);
      channel.join()
        .catch(ex => resolve());
    });
  }

  on(event, handler) {
    this.client.on(event, handler);
  }

  allMessagesConsumed(channel) {
    channel = isValidString(channel) ? this.channels[channel] : (channel || this.activeChannel)
    return channel.setAllMessagesConsumed();
  }
}