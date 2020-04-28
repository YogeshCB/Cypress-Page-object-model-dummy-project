import listFactory from '@bit/kubric.redux.packs.list';
import { at } from "@bit/kubric.utils.common.lodash";
import types from './types';
import selectors from './selectors';
import { fetchChatMessages } from "../servicetypes";
import Chat from '../../../lib/chat';
import { formatMessages } from "./formatter";

const LIST_NAME = 'chat';

const messageListTransformer = response => {
  const { lastBucket, messages } = formatMessages(response);
  const oldestBucket = selectors.getCurrentDateBucket();
  const { default: store } = require('../../../store');
  (lastBucket === oldestBucket) && store.dispatch(pack.actions.rowDeleted({
    id: oldestBucket
  }));
  return messages;
};

const pack = listFactory(LIST_NAME, {
  idField: 'id',
  service: {
    append: 'serviceData.appendAt',
    method: Chat.loadNextMessages.bind(Chat, messageListTransformer),
    data: 'response',
    types: fetchChatMessages,
    paging: 'response.1.index',
    query: 'serviceData.query'
  },
  types: {
    fetched: {
      [types.MESSAGES_FETCHED]: {
        append: 'appendAt',
        query: "query",
        data: 'data',
        paging: "data.1.index"
      },
      [types.SEND_MESSAGE]: {
        query: "query",
        data: 'data'
      },
      [types.INCOMING_MESSAGE]: {
        query: "query",
        data: "data"
      }
    },
  },
  isCompleted(data, limit) {
    return data.length < limit;
  },
  getListState() {
    const { default: store } = require('../../../store');
    return at(store.getState(), `chat.data`)[0];
  },
  getServiceData({ paging }) {
    return {
      messageIndex: paging - 1,
      appendAt: 'start'
    };
  },
  limit: 50
});

export default pack;
