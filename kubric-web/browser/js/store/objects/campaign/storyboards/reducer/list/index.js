import listFactory from '@bit/kubric.redux.packs.list';
import { at } from "@bit/kubric.utils.common.lodash";
import newCampaignTypes from '../../../types';
import filterConfig from './filters';
import { fetchNewCampaignStoryboards } from "../../../../servicetypes";
import services from '../../../../../../services';

const LIST_NAME = 'campaign/storyboards';

export default listFactory(LIST_NAME, {
  idField: 'uid',
  service: {
    method: services.storyboards.get(),
    data: 'response.storyboards',
    paging: 'response.next',
    types: fetchNewCampaignStoryboards
  },
  filterConfig,
  selection: 'multiple',
  types: {
    fetched: {
      [newCampaignTypes.STORYBOARDS_FETCHED]: {
        data: 'storyboards',
        paging: 'next',
      },
    },
  },
  isCompleted(data, limit, next) {
    return typeof next === 'undefined';
  },
  getListState() {
    const { default: store } = require('../../../../../index');
    return at(store.getState(), `campaign.storyboards.data`)[0];
  }
});
