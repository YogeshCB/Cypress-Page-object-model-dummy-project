import types from '../types';
import { combineReducers } from 'redux';
import routeTypes from '../../route/types';
import creative from '../creative/reducer';
import ssupload from '../ssupload/reducer';
import creatives from '../creatives/reducer';
import storyboards from '../storyboards/reducer';
import { stringifyJson } from "../../../../../../isomorphic/utils";
import { CAMPAIGN_SB_ROUTE, CREATED_CAMPAIGN_ROUTE } from "../../../../routes";
import {
  approveCopyQC,
  approveVisualQC,
  createCampaign,
  fetchNewCampaignStoryboards,
  rejectCopyQC,
  rejectVisualQC
} from "../../servicetypes";
import assetTypes from '../../assets/types';
import reducerFactory, { actions, macros } from "@bit/kubric.redux.reducers.factory";
import { isUndefined, isNull } from "@bit/kubric.utils.common.lodash";
import bulkEdit from '../bulkedit/reducer';
import linkedStoryboards from './storyboards';
import { campaignConfig } from "./commons";

const reducers = reducerFactory({
  reducers: {
    stats: {
      defaultState: {
        loading: false
      },
      config: [{
        types: fetchNewCampaignStoryboards.INITIATED,
        action: {
          type: actions.FLAG_ON,
          to: "loading"
        }
      }, {
        types: fetchNewCampaignStoryboards.FAILED,
        action: {
          type: actions.FLAG_OFF,
          to: "loading"
        }
      }, {
        types: types.STORYBOARDS_FETCHED,
        transform: payload => ({
          completed: !payload.next,
          next: payload.next,
        })
      }]
    },
    isModalOpen: {
      macro: macros.SWITCH,
      on: types.NEW_CAMPAIGN,
      off: types.HIDE_MODAL
    },
    name: {
      defaultState: '',
      config: [{
        types: types.NAME_CHANGED,
      }, {
        types: types.CAMPAIGN_FETCHED,
        action: {
          from: "name"
        }
      }]
    },
    page: {
      defaultState: -1,
      config: [{
        types: types.PAGE_CHANGED,
      }, {
        types: routeTypes.ROUTE_LOADED,
        action: {
          from: "routeId"
        },
        transform: (routeId, currentPage) => routeId !== CREATED_CAMPAIGN_ROUTE ? (routeId === CAMPAIGN_SB_ROUTE ? 0 : -1) : currentPage
      }]
    },
    mediaFormat: {
      defaultState: "video",
      types: types.TYPE_CHANGED,
    },
    modalStatus: {
      defaultState: false,
      types: assetTypes.SHOW_TASKS,
      action: actions.FLAG_TOGGLE
    },
    confirmationDialog: {
      macro: macros.SWITCH,
      on: types.ON_GENERATE_CONFIRMATION,
      off: types.ON_CANCEL_CONFIRMATION
    },
    missingAssetsCount: {
      defaultState: "",
      types: types.ADS_WITH_MISSING_ASSETS_FETCHED,
      action: {
        from: "totalHits",
      }
    },
    id: {
      defaultState: "",
      types: createCampaign.COMPLETED,
      action: {
        from: "response.uid",
      }
    },
    bindings: {
      defaultState: [],
      transform: campaign => {
        const { template, bindings } = campaign;
        return (!isUndefined(template) && !isNull(template)) ? [template.bindings] : JSON.parse(bindings)
      },
      config: campaignConfig
    },
    tasks: {
      defaultState: {},
      types: [
        approveCopyQC.COMPLETED,
        rejectCopyQC.COMPLETED,
        approveVisualQC.COMPLETED,
        rejectVisualQC.COMPLETED,
      ],
      action: {
        from: "response.tasks",
      },
      transform: val => stringifyJson(val, {})
    },
    exported_creative_folder: {
      defaultState: '',
      defaultValue: ''
    },
    feed: {
      defaultState: '',
      transform: val => !val ? '' : val
    },
    status: '',
    uid: '',
    template: {
      defaultState: '',
      defaultValue: ''
    },
  },
  types: {
    [types.CAMPAIGN_FETCHED]:
      [{
        config: {
          exported_creative_folder: "exported_creative_folder",
          feed: "feed_url",
          status: "status",
          uid: "uid",
          tasks: "tasks",
          id: "uid",
          template: 'template.uid'
        }
      }],
    [fetchNewCampaignStoryboards.COMPLETED]:
      [{
        config: {
          stats: {
            transform({ response }) {
              return {
                completed: !response.next,
                next: response.next,
                loading: false
              }
            }
          },
        }
      }]
  }
});

export default combineReducers({
  creatives,
  creative,
  storyboards,
  ssupload,
  bulkEdit,
  linkedStoryboards,
  ...reducers,
});