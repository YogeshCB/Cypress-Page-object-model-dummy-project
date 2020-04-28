import { getAllByIds }from "@bit/kubric.redux.state.utils";
import store from '../../../store';
import { at } from "@bit/kubric.utils.common.lodash";

const attributes = state => (state || store.getState()).attributes;

const getAll = state => getAllByIds(attributes(state));

const getById = (id, state) => at(getAllById(state), id)[0];

const getAllById = state => attributes(state).byId;

const getAllIds = state => attributes(state).allIds;

export default {
  getAll,
  getById,
  getAllById,
  getAllIds,
}