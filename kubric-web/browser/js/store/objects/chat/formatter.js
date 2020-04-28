import Chat from "../../../lib/chat";
import { dateFormatter, timeFormatter } from "../../../lib/date";
import { isUndefined } from "@bit/kubric.utils.common.lodash";

export const formatMessage = ({ body, timestamp, sid, attributes, index }, sent = true) => {
  let { user } = attributes;
  if (isUndefined(user)) {
    user = {
      name: "System",
      email: "system",
    };
  }
  return ({
    type: "message",
    id: sid,
    index: index || sid,
    sent,
    payload: {
      text: !isUndefined(attributes.parts) ? attributes.parts : body,
      time: timeFormatter(timestamp),
      user: {
        ...user,
        color: Chat.getUserColor(user)
      }
    }
  });
};

export const formatMessages = ({ items = [] }, sent = true) => {
  let currentDateBucket = '';
  const messages = items.reduce((acc, message) => {
    const { timestamp } = message;
    const dateBucket = dateFormatter(timestamp);
    if (dateBucket !== currentDateBucket) {
      acc.push({
        type: "datebucket",
        id: dateBucket,
        index: dateBucket,
        payload: {
          date: dateBucket
        },
      });
      currentDateBucket = dateBucket;
    }
    acc.push(formatMessage(message, sent));
    return acc;
  }, []);
  return {
    messages,
    lastBucket: currentDateBucket
  }
};
