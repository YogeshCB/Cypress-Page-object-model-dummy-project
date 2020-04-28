import babelPolyfill from "@babel/polyfill";
import twilio from 'twilio';
import config from 'config';
import logger from '../lib/logger';

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


chatService
  .channels("CHf7f4f611478b4988a1caf1283dd9f75e")
  .messages("IM62f0ffa6305347d58bf6219540c210d3")
  .remove()
  .then(console.log);

// let count = 0;
// let index = 0;
// const intervalId = setInterval(async () => {
//   const channelSid = channels[index];
//   const channel = await chatService
//     .channels(channelSid)
//     .fetch();
//   if (channel.messagesCount > 0 && channel.membersCount > 0) {
//     const members = await chatService
//       .channels(channelSid)
//       .members
//       .list({ limit: 200 });
//     members.forEach(async member => {
//       await member.update({
//         lastConsumedMessageIndex: channel.messagesCount - 1
//       });
//     })
//   }
//   count++;
//   console.log(parseInt(count / channels.length * 100));
//   index++;
//   if (index === channels.length) {
//     clearInterval(intervalId);
//   }
// }, 1000);