import listFactory from '@bit/kubric.redux.packs.list';
import store from '../../index';
import { at } from "@bit/kubric.utils.common.lodash";
import { getInsights } from "../servicetypes";
import services from '../../../services';

const LIST_NAME = 'insights';

export default listFactory(LIST_NAME, {
  idField: 'ad_id',
  service: {
    method: services.insights.get(),
    data: 'response',
    types: getInsights
  },
  getListState() {
    return at(store.getState(), `insights.data`)[0];
  }
});
