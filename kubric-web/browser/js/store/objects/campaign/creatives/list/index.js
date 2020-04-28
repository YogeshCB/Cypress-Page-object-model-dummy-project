import listFactory, { hooks } from '@bit/kubric.redux.packs.list';
import services from '../../../../../services';
import { at } from "@bit/kubric.utils.common.lodash";
import campaignSelectors from "../../selectors";
import filterConfig from './filters';
import {
  deleteCreative,
  updateAd,
  singleAdVideo,
  singleAdPublish,
  getNewCampaignAds,
  saveCreative,
  resolveCreative
} from "../../../servicetypes";
import campaignTypes from "../../types";

const LIST_NAME = 'creatives';

export default listFactory(LIST_NAME, {
  idField: 'uid',
  service: {
    method: services.campaign.getAds(),
    data: 'response.data',
    types: getNewCampaignAds,
    paging: 'response.next',
    totalHits: 'response.totalHits',
  },
  filterConfig,
  types: {
    fetched: {
      [campaignTypes.CREATIVES_FETCHED]: {
        data: 'data',
        totalHits: 'totalHits',
        paging: 'next',
        filters: {
          tabs: "all"
        }
      },
      [saveCreative.COMPLETED]: {
        data: 'response.data',
        filters: {
          tabs: "all"
        }
      },
    },
  },
  hooks: {
    [updateAd.INITIATED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADING]
    },
    [singleAdVideo.INITIATED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADING]
    },
    [resolveCreative.INITIATED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADING]
    },
    [saveCreative.INITIATED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADING]
    },
    [deleteCreative.INITIATED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADING]
    },
    [singleAdPublish.INITIATED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADING]
    },
    [updateAd.COMPLETED]: {
      idField: 'extraData.id',
      dataField: 'response.data',
      actions: [hooks.ROW_UPDATED, hooks.MARK_LOADED, hooks.MARK_UNDIRTY]
    },
    [singleAdVideo.COMPLETED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [singleAdPublish.COMPLETED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [saveCreative.COMPLETED]: {
      idField: 'extraData.id',
      dataField: 'response.data',
      actions: [hooks.ROW_UPDATED, hooks.MARK_LOADED]
    },
    [deleteCreative.COMPLETED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [resolveCreative.COMPLETED]: {
      idField: 'extraData.id',
      dataField: 'response',
      actions: [hooks.ROW_UPDATED, hooks.MARK_LOADED]
    },
    [singleAdVideo.FAILED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [singleAdPublish.FAILED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [updateAd.FAILED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [deleteCreative.FAILED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [resolveCreative.FAILED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    },
    [saveCreative.FAILED]: {
      idField: 'extraData.id',
      actions: [hooks.MARK_LOADED]
    }
  },
  isCompleted(data, limit, next) {
    return typeof next === 'undefined';
  },
  getListState() {
    const { default: store } = require('../../../../../store');
    return at(store.getState(), `campaign.creatives.data`)[0];
  },
  getServiceData({ paging: start } = {}) {
    return {
      campaignId: campaignSelectors.getCampaignId(),
      start,
    }
  }
});
