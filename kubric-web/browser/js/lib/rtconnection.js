import socketio from 'socket.io-client';
import { getCurrentRoot } from "./utils";
import { isUndefined } from "@bit/kubric.utils.common.lodash";

const origin = getCurrentRoot();

export default class RTConnection {
  static cache = {};

  static getInstance(namespace) {
    let cached = RTConnection.cache[namespace];
    if (isUndefined(cached)) {
      cached = new RTConnection(namespace);
    }
    RTConnection.cache[namespace] = cached;
    return cached;
  }

  constructor(channel = '') {
    this.namespace = channel;
    this.connected = false;
  }

  connect() {
    return new Promise(resolve => {
      if (!this.connected) {
        this.socket = socketio(this.namespace).connect(origin, {
          reconnection: true
        }).on('connect', () => {
          this.connected = true;
          resolve();
        });
      }
    });
  }

  disconnect() {
    if (this.connected) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  on(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);
    } else {
      return false;
    }
  }

  emit(event, payload) {
    if (this.connected) {
      this.socket.emit(event, payload);
    } else {
      throw new Error("Attempt to emit on disconnected socket!!");
    }
  }

  getSocket() {
    return this.socket;
  }
};
