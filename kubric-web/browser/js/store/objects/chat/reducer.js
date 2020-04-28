import types from './types';
import listPack from './list';
import { combineReducers } from "redux";
import { getAppendReducers, getExtractReducers } from "@bit/kubric.redux.reducers.payload";
import { fetchChatMessages, fetchCurrentWorkspaceUsers } from "../servicetypes";
import { isUndefined, isString } from "@bit/kubric.utils.common.lodash";
import Chat from "../../../lib/chat";
import userSelectors from "../user/selectors";

const dateBucketTransformer = val => isUndefined(val) ? '' : val;

const tagUsersTransformer = (users = []) => {
  const currentUser = userSelectors.getUserEmail();
  return users.reduce((acc, { name = "", email, profile_image_url: pic = "" }) => {
    if (email !== currentUser) {
      name = isString(name) ? name : "";
      pic = isString(pic) ? pic : "";
      let label = name.length > 0 ? name : email.split("@")[0];
      acc.push({
        id: email,
        label,
        dp: pic.length > 0 ? pic : Chat.getUserColor({
          name: label,
          email
        })
      });
    }
    return acc;
  }, []);
};

export default combineReducers({
  data: listPack.reducer,
  ...getAppendReducers({
    connectedChannels: {
      type: [types.CHANNEL_CONNECTED],
      defaultState: {}
    },
    connectingChannels: {
      type: [types.CHANNEL_CONNECTING],
      defaultState: {}
    },
    usercolors: {
      type: [types.SET_USER_COLOR],
      defaultState: {}
    }
  }),
  ...getExtractReducers({
    tagUsers: {
      type: [fetchCurrentWorkspaceUsers.COMPLETED],
      path: "response",
      defaultState: [],
      transform: tagUsersTransformer
    },
    currentDateBucket: {
      types: [{
        type: types.MESSAGES_FETCHED,
        path: 'data.0.payload.date',
        transformer: dateBucketTransformer
      }, {
        type: fetchChatMessages.COMPLETED,
        path: 'response.0.payload.date',
        transformer: dateBucketTransformer
      }],
      defaultState: ''
    },
  })
});