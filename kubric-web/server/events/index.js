import socketio from 'socket.io';
import { connections } from "../../isomorphic/sockets";
import setupCampaignEvents from './campaigns';
import _ from 'lodash';

const nspMap = {
  [connections.CAMPAIGN]: setupCampaignEvents
};

export const initialize = (server, sessionCache) => {
  const io = socketio.listen(server);
  console.log('Socket layer initialized');
  _.forOwn(nspMap, (handler, namespace) => {
    const nsp = io.of(namespace);
    nsp.on('connection', handler.bind(null, sessionCache, io));
  });
  return io;
};