import listFactory from '@bit/kubric.redux.packs.list';
import { at } from "@bit/kubric.utils.common.lodash";
import types from './types';

const LIST_NAME = 'messages';

const pack = listFactory(LIST_NAME, {
  idField: 'id',
  types: {
    fetched: {
      [types.MESSAGES_FETCHED]: true,
    },
  },
  getListState() {
    const { default: store } = require('../../../store');
    return at(store.getState(), `messages.data`)[0];
  },
});

export default pack;
