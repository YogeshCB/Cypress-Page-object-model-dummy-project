import listPack from './list';
import {
  combineReducers
} from "redux";
import reducerFactory, {
  actions
} from "@bit/kubric.redux.reducers.factory";
import flagReducer from '@bit/kubric.redux.reducers.flag';
import types from './types';

export default combineReducers( {
  data: listPack.reducer,
  ...flagReducer( 'isPreferenceVisible', {
    toggle: types.TOGGLE_PREFERENCES,
  } ),
  ...reducerFactory( {
      reducers: {
        isSetup: {
          defaultState: false,
          types: types.MESSAGES_SETUP,
          action: actions.FLAG_ON
        },
        subscriptions: {
          defaultState: [],
          config: [{
              action: {
                type: actions.ASSIGN_PAYLOAD,
                from: "data",
              },
              types: types.NOTIFICATION_SUBSCRIPTIONS_FETCHED,
            },
            {
              action: {
                from: "payload",
                type: actions.ASSIGN_PAYLOAD
              },
              types: types.NOTIFICATION_PREFERENCE_CHANGE
            },
            {
              action: {
                from: "payload",
                type: actions.ASSIGN_PAYLOAD
              },
              types: types.PURGE_NOTIFICATIONS
            }
          ]
      },
      notifications: {
        defaultState: [],
        config: [
          {
            action: {
              from: "data",
              type: actions.ASSIGN_PAYLOAD
            },
            types: types.NOTIFICATIONS_FETCHED,
          },
          {
            action: {
              from: "payload",           
              type: actions.ASSIGN_PAYLOAD
            },
            types: types.PURGE_NOTIFICATIONS
          }
          ]
      },
      config: {
        defaultState: {
          channels: {},
          'notification-type': {}
        },
        types: types.NOTIFICATION_CONFIG_FETCHED,
        action: {
          from: "data",
          type: actions.ASSIGN_PAYLOAD
        }
      }
    }
  } ),
} );