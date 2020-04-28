import twilio from 'twilio';
import Express from 'express';
import config from 'config';
import logger from '../lib/logger';
import _ from 'lodash';
import messages from "../lib/messages";
import services from "../services";
import { getCreativeChannelSid } from "../../isomorphic/utils";

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const twilioConfig = config.get("twilio");
const {
  apiKey: API_KEY,
  appName: APP_NAME,
  authToken: AUTH_TOKEN,
  apiSecret: API_SECRET,
  accountSid: ACCOUNT_SID,
  serviceSid: SERVICE_SID
} = twilioConfig;
const Router = Express.Router();
const chatService = twilio(ACCOUNT_SID, AUTH_TOKEN).chat.services(SERVICE_SID);

const errors = {
  member: {
    EXISTS: 50404,
    NOT_FOUND: 20404
  },
  user: {
    EXISTS: 50201
  }
};

const checkAndCreateUser = async (email, name, dp, { shouldUpdate = false, shouldFetch = false } = {}) => {
  const userData = {
    friendlyName: name,
    attributes: JSON.stringify({
      dp
    })
  };
  try {
    return await chatService
      .users
      .create({
        identity: email,
        ...userData
      });
  } catch (ex) {
    const { code } = ex;
    if (code === errors.user.EXISTS) {
      let userSid, user;
      if (shouldUpdate || shouldFetch) {
        user = await chatService
          .users(email)
          .fetch();
        userSid = user.sid;
      }
      if (shouldUpdate) {
        return await chatService
          .users(userSid)
          .update(userData);
      } else if (shouldFetch) {
        return user;
      } else {
        return true;
      }
    }
    throw ex;
  }
};

const checkAndCreateChannel = async (name, id) => {
  try {
    return await chatService
      .channels(id)
      .fetch();
  } catch (ex) {
    const { status } = ex;
    if (status === 404) {
      return await chatService
        .channels
        .create({
          friendlyName: name,
          uniqueName: id
        });
    }
    throw ex;
  }
};

const checkAndAddMember = async (email, channelSid) => {
  try {
    return await chatService
      .channels(channelSid)
      .members(email)
      .fetch();
  } catch (ex) {
    const { code } = ex;
    if (code === errors.member.NOT_FOUND) {
      return await chatService
        .channels(channelSid)
        .members
        .create({
          identity: email
        });
    }
    throw ex;
  }
};

Router.post('/channel/create', async (req, res) => {
  const { email, name: userName, profile_image_url: dp } = req._sessionData;
  const { name, id } = req.body;
  try {
    const [channel, user] = await Promise.all([
      checkAndCreateChannel(name, id),
      checkAndCreateUser(email, userName, dp, {
        shouldUpdate: true,
        shouldFetch: true
      })
    ]);
    const { sid: channelSid } = channel;
    const { sid: memberSid } = await checkAndAddMember(email, channelSid);
    res.status(200).send({
      channelSid,
      memberSid,
      userSid: user.sid
    });
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(ex);
  }
});

Router.get('/token', (req, res) => {
  const { email } = req._sessionData;
  const endpointId = `${APP_NAME}::${email}`;
  const chatGrant = new ChatGrant({
    serviceSid: SERVICE_SID,
    endpointId,
  });
  const token = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);
  token.addGrant(chatGrant);
  token.identity = email;

  res.send({
    token: token.toJwt(),
  });
});

const updateMemberMention = async (operation, channel, res, user) => {
  const { email } = user;
  let member;
  try {
    member = await checkAndAddMember(email, channel);
  } catch (ex) {
    logger.error(ex);
    return res.status(500).send(messages.getResponseMessage('services.chat.mentions.NONMEMBER_USER'));
  }
  const { attributes: attrString = "{}" } = member;
  const attributes = JSON.parse(attrString);
  const { mentions = 0 } = attributes;
  return member.update({
    attributes: JSON.stringify({
      ...attributes,
      mentions: operation === "increment" ? mentions + 1 : 0
    })
  });
};

const postChatEvent = (adData, campaign, sessionData, user) => {
  const eventData = {
    "action": "chat-mention",
    "created_by": "system",
    "created_on": (new Date()).getTime(),
    "data": {
      "who": user.email,
      "where": "in-app",
      "when": "instant",
      "what": {
        "workspace_id": sessionData.workspace_id,
        "campaign_id": campaign.id,
        "campaign_name": campaign.name,
        "campaign_ad_id": adData.uid,
        "from": sessionData.email
      }
    }
  };
  services.events.postEvent().send({
      ...sessionData,
      eventData,
      beta: process.env.NODE_ENV === "production" ? "false" : "true"
    })
    .catch(console.error);
};

const updateMembersWithMention = async (operation, req, res) => {
  let { creative = "", channel = "", user = [], campaign = {} } = req.body;
  user = Array.isArray(user) ? user : [user];
  if (channel.length === 0 && creative.length === 0) {
    return res.status(400).send(messages.getResponseMessage('services.chat.mentions.NO_CHANNEL'));
  } else if (user.length === 0) {
    return res.status(400).send(messages.getResponseMessage('services.chat.mentions.NO_USERS'));
  } else {
    const usersValid = user.every(({ email }) => _.isString(email) && email.length > 0);
    if (!usersValid) {
      return res.status(400).send(messages.getResponseMessage('services.chat.mentions.INVALID_USERS'));
    } else {
      let adData;
      if (_.isString(creative) && creative.length > 0) {
        let { data = {} } = await services.campaign.getAd().send({
          ...req._sessionData,
          ad: creative
        });
        adData = data;
        channel = getCreativeChannelSid(data);
      }
      const updatePromises = user.map(singleUser => {
        operation === "increment" && postChatEvent(adData, campaign, req._sessionData, singleUser);
        return updateMemberMention(operation, channel, res, singleUser);
      });
      const results = await Promise.all(updatePromises);
      return res.status(200).send(results);
    }
  }
};

Router.put('/mention', updateMembersWithMention.bind(null, "increment"));

Router.delete('/mention/:creative', [(req, res, next) => {
  req.body = {
    user: {
      email: req._sessionData.email,
    },
    creative: req.params.creative
  };
  next();
}, updateMembersWithMention.bind(null, "clear")]);

export default Router;