import listFactory from '@bit/kubric.redux.packs.list';
import store from '../../../index';
import { at } from "@bit/kubric.utils.common.lodash";
import filterConfig from './filters';
import campaignTypes from '../../campaigns/types';
import { fetchCampaigns } from "../../servicetypes";
import services from '../../../../services';

const LIST_NAME = 'campaigns';

export default listFactory(LIST_NAME, {
  idField: 'uid',
  service: {
    method: services.campaigns.get(),
    data: 'response.data',
    paging: 'response.next',
    types: fetchCampaigns
  },
  filterConfig,
  types: {
    fetched: {
      [campaignTypes.CAMPAIGNS_FETCHED]: {
        paging: 'next',
        data: 'data',
      },
    },
  },
  isCompleted(data, limit, next) {
    return typeof next === 'undefined';
  },
  getListState() {
    return at(store.getState(), `campaigns.data`)[0];
  }
});
