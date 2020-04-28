import types from './types';
import { getActions } from "@bit/kubric.redux.reducks.utils";
import notificationActions from "../notifications/actions";
import { at } from "@bit/kubric.utils.common.lodash";
import { getFormErrorActions } from "../commons/formerrors";

const publishOptionsFailed = (error = {}) => notificationActions.addNotification({
  type: 'error',
  heading: 'Unable to publish',
  desc: at(error, 'response.body.message', 'Please try after some time')[0],
});

export const formErrorActions = getFormErrorActions('publisher');

export default {
  ...getActions(types),
  publishOptionsFailed,
};