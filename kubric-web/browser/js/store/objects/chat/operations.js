import actions from './actions';
import { getOperations } from "@bit/kubric.redux.reducks.utils";
import userSelectors from "../user/selectors";
import campaignSelectors from "../campaign/selectors";
import selectors from "./selectors";
import chatListPack from "./list";
import Chat from "../../../lib/chat";
import { formatMessage } from "./formatter";
import { isUndefined, at, set, isString } from "@bit/kubric.utils.common.lodash";
import services from "../../../services";
import { unreadCountUpdater } from "./listeners";
import { getOpenedCreative, allMessagesConsumed } from "../campaign/creatives/utils";
import { creativeChannelSidPath, parseCreativeMeta } from "../../../../../isomorphic/utils";
import chatSelectors from "../chat/selectors";

const getUser = () => {
  const { email, profile_image_url: dp, name } = userSelectors.user();
  return {
    email,
    dp,
    name
  };
};

const onChatInitiated = creative => async dispatch => {
  const chatInstance = Chat.getInstance();
  const { uid: id } = creative;
  const [audId] = at(creative, 'source.segment.aud_id');
  let [audName] = at(creative, 'source.segment.name');
  audName = audName || audId;
  const meta = parseCreativeMeta(creative);
  const channelId = Chat.getChannelId(Chat.channelTypes.CREATIVE, id);
  const email = userSelectors.getUserEmail();
  dispatch(chatListPack.actions.queryChange(channelId));
  dispatch(actions.channelSelected({
    channelId,
    creativeId: id
  }));
  if (!selectors.isChannelConnecting(channelId) && !selectors.isChannelConnected(channelId)) {
    dispatch(actions.channelConnecting({
      [channelId]: true
    }));
    const campaignName = campaignSelectors.getCampaignName();
    const campaignId = campaignSelectors.getCampaignId();
    const { channelSid, messages = [], created } = await chatInstance.setupChannel({
      name: `${campaignName}/${audName}`,
      creative
    });
    dispatch(actions.channelConnecting({
      [channelId]: false
    }));
    setImmediate(() => dispatch(actions.channelConnected({
      [channelId]: channelSid
    })));
    dispatch(actions.messagesFetched({
      data: messages,
      appendAt: 'start',
      query: channelId
    }));
    if (created) {
      const updatedMeta = set(meta, creativeChannelSidPath, channelSid, {
        create: true
      });
      unreadCountUpdater({
        eventsOnly: true,
        sid: channelSid,
        channelId,
        creativeId: id,
        email,
      });
      await services.campaign.saveCreative()
        .send({
          campaignId,
          creativeId: id,
          meta: updatedMeta
        });
    }
  }
  //If the user opens one channel after the other without waiting for the first to complete,
  //there will be multiple channel creation requests going. Only if the currently opened creative
  //matches the channel id in the context will the channel be set as the active one
  const currentCreative = getOpenedCreative();
  if(!isUndefined(currentCreative)) {
    const currentChannel = Chat.getChannelId('creative', currentCreative.uid);
    if (currentChannel === channelId) {
      await chatInstance.setActiveChannel(channelId);
      await allMessagesConsumed(dispatch, currentCreative.uid);
    }
  }
};

const registerMentions = (creativeId, messageParts = []) => {
  let mentionsRegister = {};
  const tagUsers = chatSelectors.getTagUsers();

  const usersToTag = [];
  messageParts[0].forEach(({ type, value = {} }) => {
    const { type: valueType, id: user } = value;
    if (type === "mention" && valueType === "user" && !mentionsRegister[user]) {
      const [{ label: name = "", id: email = "", dp = "" }] = tagUsers.filter(({ id }) => id === user);
      usersToTag.push({
        name,
        email,
        dp: isString(dp) ? dp : ""
      });
      mentionsRegister[user] = true;
    }
  });
  if (usersToTag.length > 0) {
    services.chat.registerMentions()
      .send({
        creativeId,
        user: usersToTag,
        campaign: {
          id: campaignSelectors.getCampaignId(),
          name: campaignSelectors.getCampaignName()
        }
      });
  }
};

const onSendMessage = ({ message = {}, data: creative = {} } = {}) => async dispatch => {
  const { text = '', parts = [] } = message;
  if (text.length > 0 && !isUndefined(creative)) {
    const { uid: id } = creative;
    const channelId = Chat.getChannelId(Chat.channelTypes.CREATIVE, id);
    const user = getUser();
    const timestamp = new Date();
    const tempMessageSid = `${user.email}.${timestamp.getTime()}`;
    dispatch(actions.sendMessage({
      query: channelId,
      data: formatMessage({
        attributes: {
          user,
          parts
        },
        body: text,
        sid: tempMessageSid,
        timestamp,
      }, false),
    }));
    const chatInstance = Chat.getInstance();
    await chatInstance.sendMessage({
      creative,
      text,
      user,
      parts
    });
    registerMentions(id, parts);
    dispatch(chatListPack.actions.rowChange({
      id: tempMessageSid,
      data: {
        sent: true
      }
    }));
  }
};

export default {
  ...getOperations(actions),
  onChatInitiated,
  onSendMessage
};