import rtManager from '../../../lib/rtmanager';
import chatTypes from "./types";
import { isUndefined, at, isValidString, isFunction } from "@bit/kubric.utils.common.lodash";
import Chat from "../../../lib/chat";
import actions from "./actions";
import { formatMessage } from "./formatter";
import userSelectors from "../user/selectors";
import store from "../../index";
import campaignTypes from "../campaign/types";
import creativesListPack from "../campaign/creatives/list";
import creativesSelectors from "../campaign/creatives/selectors";
import { getOpenedCreative, allMessagesConsumed } from "../campaign/creatives/utils";
import { getCreativeChatSettings } from "../../../../../isomorphic/utils";
import { errors } from "../../../lib/chat/constants";
import routeTypes from "../route/types";

const isChatVisible = creativeId => {
  const openedCreative = getOpenedCreative();
  const panelTab = creativesSelectors.getPanelTab();
  // Chat is visible if there is a creative opened and it's id matches the creativeId passed and the current panelTab is "discuss"
  return !isUndefined(openedCreative) && openedCreative.uid === creativeId && panelTab === 'discuss';
};

const listenedChannels = {
  messageAdded: {},
  memberUpdated: {},
  channelUpdated: {}
};

const removeChatListeners = event => {
  const attachedChannels = listenedChannels[event];
  Object.keys(attachedChannels).forEach(channelId => {
    const { channel, handler } = attachedChannels[channelId];
    channel.removeListener(event, handler);
  });
};

const listenForMessages = async ({ payload = {} }) => {
  const { channelId, creativeId } = payload;
  const attachedChannels = listenedChannels.messageAdded;
  if (!isUndefined(channelId) && isUndefined(attachedChannels[channelId])) {
    attachedChannels[channelId] = true;
    listenedChannels.messageAdded = attachedChannels;
    const chatInstance = Chat.getInstance();
    let channel = chatInstance.getChannel(channelId);
    if (isFunction(channel.then)) {
      const channelResults = await channel;
      channel = channelResults.channel;
    }
    if (!isUndefined(channel)) {
      const messageAddedHandler = message => {
        const [messageUser] = at(message, 'attributes.user.email');
        const currentUser = userSelectors.getUserEmail();
        //If message user is same as the current user, it means that the message has already been added to the state
        if (messageUser !== currentUser) {
          store.dispatch(actions.incomingMessage({
            query: channelId,
            data: formatMessage(message)
          }));
        }
        if (isChatVisible(creativeId)) {
          allMessagesConsumed(store.dispatch, creativeId);
        }
      };
      channel.on('messageAdded', messageAddedHandler);
      return {
        types: [routeTypes.ROUTE_LOADED],
        handler: () => channel.removeListener("messageAdded", messageAddedHandler)
      };
    }
  }
};

export const unreadCountUpdater = async ({ sid, channelId, creativeId, email, eventsOnly = false }) => {
  try {
    const chatInstance = Chat.getInstance();
    const channel = await chatInstance.fetchChannel(sid, channelId);

    const updateUnreadCount = async (tryToJoin = false) => {
      const { unreadCount, mentionCount } = await chatInstance.getUnreadMessagesCount({
        email,
        channel,
        tryToJoin
      });
      const unreadChatCount = mentionCount > 0 ? mentionCount : (unreadCount > 0);
      //update only if there is something to be shown i.e. either unreadChatCount is true or a number > 0
      unreadChatCount && store.dispatch(creativesListPack.actions.rowChange({
        id: creativeId,
        data: {
          unreadChatCount
        }
      }));
    };

    const memberUpdatedHandler = async ({ member, updateReasons = [] }) => {
      const lastMessage = await chatInstance.getLastMessage(channel);
      const [lastMessageUser] = at(lastMessage, 'state.attributes.user.email');
      const [mentionsCount] = at(lastMessage, 'state.attributes.mentions', 0);
      const lastConsumedChanged = updateReasons.indexOf("lastConsumedMessageIndex") > -1;
      const attributesChanged = updateReasons.indexOf("attributes") > -1;
      const isValidReason = lastConsumedChanged || attributesChanged;
      if (member.identity === email && lastMessageUser !== email && isValidReason) {
        if (!isChatVisible(creativeId)) {
          updateUnreadCount();
        } else {
          allMessagesConsumed(store.dispatch, creativeId, attributesChanged && (mentionsCount > 0));
        }
      }
    };

    const channelUpdatedHandler = ({ channel, updateReasons = [] }) => {
      //If the user is currently viewing the chat window, unread message count need not be updated
      channel.sid === sid && updateReasons.indexOf("lastMessage") > -1 && !isChatVisible(creativeId) && updateUnreadCount();
    };

    if (!at(listenedChannels, `memberUpdated.${channelId}`, false)[0]) {
      channel.on('memberUpdated', memberUpdatedHandler);
      listenedChannels.memberUpdated[channelId] = {
        channel,
        handler: memberUpdatedHandler
      }
    }
    if (!at(listenedChannels, `channelUpdated.${channelId}`, false)[0]) {
      channel.on('channelUpdated', channelUpdatedHandler);
      listenedChannels.channelUpdated[channelId] = {
        channel,
        handler: channelUpdatedHandler
      }
    }

    !eventsOnly && updateUnreadCount(true);
  } catch (ex) {
    if (ex.code !== errors.MISSING_CHANNEL) {
      console.error(ex);
    }
  }
};

const setupUnreadCounts = async ({ payload = {} }) => {
  await Chat.getInstance().init();
  const { data = [] } = payload;
  const email = userSelectors.getUserEmail();
  if (data.length > 0) {
    data.forEach(async creative => {
      const chatSettings = getCreativeChatSettings(creative) || {};
      const { channelSid } = chatSettings;
      const { uid: id } = creative;
      const channelId = Chat.getChannelId(Chat.channelTypes.CREATIVE, id);
      if (isValidString(channelSid)) {
        try {
          unreadCountUpdater({
            sid: channelSid,
            channelId,
            creativeId: id,
            email
          });
        } catch (ex) {
          console.error(ex);
        }
      }
    });
  }

  return {
    types: [routeTypes.ROUTE_LOADED],
    handler: () => {
      removeChatListeners('channelUpdated');
      removeChatListeners('memberUpdated');
    }
  };
};

rtManager.registerListener([chatTypes.CHANNEL_SELECTED], listenForMessages);
rtManager.registerListener([campaignTypes.CREATIVES_FETCHED, campaignTypes.CREATIVES_LOADED], setupUnreadCounts);