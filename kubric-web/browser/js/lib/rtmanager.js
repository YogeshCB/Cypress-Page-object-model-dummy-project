import { isFunction, isUndefined } from '@bit/kubric.utils.common.lodash';

const LISTENERS_QUEUE = 'listeners';
const UNLISTENERS_QUEUE = 'unlisteners';

export class RTManager {
  constructor() {
    this.status = "idle";
    this.listeners = {};
    this.unlisteners = {};
  }

  updateQueue(queueType, types, handler) {
    if (!Array.isArray(types)) {
      types = [types];
    }
    if (!isFunction(handler)) {
      throw new Error(`Attempt to register invalid ${queueType === 'listeners' ? 'listen' : 'unlisten'} handler for types - ${JSON.stringify(types)}`);
    }
    types.forEach(type => {
      const queue = this[queueType][type] || [];
      const isAlreadyQueued = queue.some(registeredHandler => registeredHandler === handler);
      !isAlreadyQueued && queue.push(handler);
      this[queueType][type] = queue;
    });
  }

  clearQueue(queueType, type) {
    this[queueType][type] = [];
  }

  processHandlerResults(action, results) {
    if (!isUndefined(results)) {
      let { types = [], handler } = results;
      if (!Array.isArray(types)) {
        types = [types];
      }
      if (!isFunction(handler)) {
        throw new Error(`Invalid unlisten handler returned by listener for type ${type}`);
      }
      this.registerUnlistener(types, handler, action);
    }
  }

  invokeQueue(queueType, type, action) {
    const queue = this[queueType][type] || [];
    if (queue.length > 0) {
      queue.forEach(handler => {
        const results = handler(action);
        if (queueType === LISTENERS_QUEUE && !isUndefined(results)) {
          if (isFunction(results.then)) {
            results.then(this.processHandlerResults.bind(this, action));
          } else {
            this.processHandlerResults(action, results);
          }
        }
      });
    }
  }

  registerListener(types, handler, options = {}) {
    const { unlisteners = {} } = options;
    const { types: unlistenTypes = [], handler: unlistenHandler } = unlisteners;
    this.updateQueue(LISTENERS_QUEUE, types, handler);
    unlistenTypes.length > 0 && this.registerUnlistener(unlistenTypes, unlistenHandler);
  }

  registerUnlistener(types, handler, action) {
    this.updateQueue(UNLISTENERS_QUEUE, types, handler, action);
  }

  listen(type, action) {
    this.invokeQueue(LISTENERS_QUEUE, type, action);
  }

  unlisten(type, action) {
    this.invokeQueue(UNLISTENERS_QUEUE, type, action);
    this.clearQueue(UNLISTENERS_QUEUE, type, action);
  }

  unregisterListener(types, handler) {
    if (!Array.isArray(types)) {
      types = [types];
    }
    types.forEach(type => {
      let listeners = this.listeners[type] || [];
      if (isUndefined(handler)) {
        listeners = [];
      } else {
        listeners = listeners.filter(listener => listener !== handler);
      }
      this.listeners[type] = listeners;
    });
  }
}

const rtManager = new RTManager();

export default rtManager;