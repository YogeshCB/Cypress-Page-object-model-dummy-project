import store from '../../../store';
import { at } from "@bit/kubric.utils.common.lodash";
import { getAllByIds }from "@bit/kubric.redux.state.utils";;

const uploadtasks = state => (state || store.getState()).uploadtasks;

const getTaskById = (key, state) => typeof key !== 'undefined' ? at(uploadtasks(state), `byId.${key}`)[0] : undefined;

const getAll = state => getAllByIds(uploadtasks(state));

const getInProgressCount = state => getAll(state).filter(({ status }) => status === 'initiated').length;

const getCompletedCount = state => getAll(state).filter(({progress})=> progress === 100).length;

const getFailedCount = state => getAll(state).filter(({ status }) => status === 'failed').length;

export default {
  getTaskById,
  getAll,
  getInProgressCount,
  getFailedCount,
  getCompletedCount
};