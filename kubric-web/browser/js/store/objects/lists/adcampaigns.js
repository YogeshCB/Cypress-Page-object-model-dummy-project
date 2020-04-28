import listFactory from '@bit/kubric.redux.packs.list';
import store from '../../index';
import { at } from "@bit/kubric.utils.common.lodash";
import { getAdCampaigns } from "../servicetypes";
import services from '../../../services';

export default listFactory('adcampaigns', {
  idField: 'id',
  service: {
    method: services.publisher.getAdCampaigns(),
    data: 'response.data',
    paging: 'response.paging',
    types: getAdCampaigns
  },
  isCompleted(data, limit) {
    return data.length < limit;
  },
  getListState() {
    return at(store.getState(), `publisher.adcampaigns`)[0];
  },
});
