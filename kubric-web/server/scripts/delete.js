import babelPolyfill from "@babel/polyfill";
import twilio from 'twilio';
import config from 'config';

const twilioConfig = config.get("twilio");
const {
  authToken: AUTH_TOKEN,
  accountSid: ACCOUNT_SID,
  serviceSid: SERVICE_SID
} = twilioConfig;

const chatService = twilio(ACCOUNT_SID, AUTH_TOKEN).chat.services(SERVICE_SID);


let channelsToDelete = [];

const deleteChannels = (channels = []) =>
  Promise.all(channels.map(({ name, sid }) => chatService.channels(sid)
    .remove()
    .then(() => console.log(`${name}/${sid}`))));

const DELETE_SIZE = 30;
chatService
  .channels
  .list({
    pageSize: 1000
  })
  .then(channels => {
    console.log(`Total channel count: ${channels.length}`);
    channels.forEach(({ messagesCount, friendlyName, sid }) => {
      if (messagesCount === 0) {
        channelsToDelete.push({
          name: friendlyName,
          sid
        });
      }
    });
  })
  .then(() => console.log(`Total to be deleted: ${channelsToDelete.length}`))
  .then(() => {
    if (channelsToDelete.length > 0) {
      let deleted = 0;
      const deleter = () =>
        deleteChannels(channelsToDelete.slice(0, DELETE_SIZE))
          .then(() => {
            deleted += DELETE_SIZE;
            console.log(`\nDeleted: ${deleted}\n`);
            channelsToDelete.splice(0, DELETE_SIZE);
            if (channelsToDelete.length > 0) {
              return new Promise((resolve, reject) => {
                setTimeout(
                  () => deleter()
                    .then(resolve)
                    .catch(reject), 1000);
              });
            } else {
              return true;
            }
          });
      return deleter();
    } else {
      return true;
    }
  });