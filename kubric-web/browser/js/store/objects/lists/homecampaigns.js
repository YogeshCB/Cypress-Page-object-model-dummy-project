import listFactory from '@bit/kubric.redux.packs.list';
import store from '../../index';
import { at } from "@bit/kubric.utils.common.lodash";
import homeTypes from '../home/types';

const LIST_NAME = 'homecampaigns';

export default listFactory(LIST_NAME, {
  idField: 'uid',
  types: {
    fetched: {
      [homeTypes.CAMPAIGN_DETAILS_FETCHED]: true,
    },
  },
  getListState() {
    return at(store.getState(), `home.campaigns`)[0];
  }
});
