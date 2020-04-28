import { throttle } from "@bit/kubric.utils.common.lodash";
import { utilTypes } from "../objects/commons/types";
import { utilActions } from "../objects/commons/actions";

export default class Throttler {
  constructor() {
    this.queue = [];
    this.actions = new Set();
  }

  enable(actions = [], delay = 1000) {
    actions = Array.isArray(actions) ? actions : [actions];
    this.actions = new Set(actions);
    this.throttledDispatch = throttle(::this.dispatch, delay);
  }

  dispatch(store) {
    const payload = [...this.queue];
    this.queue = [];
    store.dispatch({
      ...utilActions.batchedAction(payload),
      __throttler__: true
    });
  }

  disable() {
    this.actions = new Set();
  }

  getWare() {
    return store => next => action => {
      const { type, __throttler__ = false } = action || {};
      if (!__throttler__ && this.actions.has(type)) {
        if (type === utilTypes.BATCHED_ACTION) {
          this.queue = [
            ...this.queue,
            ...(action.payload || [])
          ];
        } else {
          this.queue.push(action);
        }
        this.throttledDispatch(store);
      } else {
        return next(action);
      }
    };
  }
};
