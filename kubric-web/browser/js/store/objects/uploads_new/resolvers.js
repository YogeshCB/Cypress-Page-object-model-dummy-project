import { bindFunctions } from "@bit/kubric.utils.common.lodash";
import { getAllByIds } from "@bit/kubric.redux.state.utils";

const getData = selectors => getAllByIds(selectors.getState());

const getById = (selectors , id) => selectors.getById(id);

const getInprogressCount = selectors => selectors.getInProgress().length;

const getSuccessCount = selectors => selectors.getSuccess().length;

const getFailedCount = selectors => selectors.getFailed().length;

const getTotalCount = selectors => selectors.getAllIds().length;

export default selectors => bindFunctions({
  getData,
  getById,
  getInprogressCount,
  getSuccessCount,
  getFailedCount,
  getTotalCount
}, selectors);