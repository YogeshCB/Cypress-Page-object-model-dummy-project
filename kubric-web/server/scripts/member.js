import babelPolyfill from "@babel/polyfill";
import twilio from 'twilio';
import config from 'config';

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

const chatService = twilio(ACCOUNT_SID, AUTH_TOKEN).chat.services(SERVICE_SID);

const channelSid = "CHcc4ea4cfa02649ada986576f4766b647";

const runMemberUpdate = async () => {
  const channel = await chatService
    .channels(channelSid)
    .fetch();
  if (channel.messagesCount > 0 && channel.membersCount > 0) {
    const members = await chatService
      .channels(channelSid)
      .members
      .list({ limit: 200 });
    members.forEach(async member => {
      try {
        const updatedMember = await member.update({
          attributes: '{ "test": 1 }'
        });
      } catch (ex) {
        console.log(ex);
      }
    })
  }
};

const runAddMember = async () => {
  try {
    // await chatService
    //   .users
    //   .create({
    //     identity: "jophin@kubric.io",
    //   });
    // const result = await chatService
    //   .channels("CHe6fdbc45ee9d423fbee5377976f85e85")
    //   .members
    //   .create({
    //     identity: "jophin@kubric.io"
    //   });
    await chatService
      .channels("CHe6fdbc45ee9d423fbee5377976f85e85")
      .members("j@k.io")
      .fetch()
  } catch (ex) {
    console.log(ex);
  }
};

runAddMember();
