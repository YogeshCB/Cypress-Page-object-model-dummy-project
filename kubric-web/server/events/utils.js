import { errorEvents, getSocketError } from "../../isomorphic/sockets";
import _ from 'lodash';

const getHandler = (handler, socket, sessionCache) => async (payload, ackFn) => {
  const { uid, payload: data } = payload;
  if (!_.isUndefined(uid)) {
    const sessionData = await sessionCache.getSession(uid);
    if (!_.isUndefined(sessionData)) {
      handler(socket, sessionData, data, ackFn);
    } else {
      ackFn(getSocketError(errorEvents.SESSION_EXPIRED));
    }
  } else {
    ackFn(getSocketError(errorEvents.MISSING_UID));
  }
};

export const getConnection = (name, { events = {}, handlers = [] }) => (sessionCache, io, socket) => {
  console.log(`${name} connection established`);
  _.forOwn(events, (handler, eventType) => socket.on(eventType, getHandler(handler, socket, sessionCache, io)));
  handlers.forEach(handler => handler(socket, sessionCache, io));
};