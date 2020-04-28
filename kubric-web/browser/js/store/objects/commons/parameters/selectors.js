import { at } from "@bit/kubric.utils.common.lodash";

const getSelectedShot = getState => at(getState(), 'shot', 0)[0];

const getCurrentParameters = getState => at(getState(), `data.${getSelectedShot(getState)}`, [])[0];

const getParameters = getState => at(getState(), 'data', [])[0];

const getLoadingParameters = getState => at(getState(), `loading.${getSelectedShot(getState)}`)[0];

export default getState => ({
  getSelectedShot: getSelectedShot.bind(null, getState),
  getCurrentParameters: getCurrentParameters.bind(null, getState),
  getParameters: getParameters.bind(null, getState),
  getLoadingParameters: getLoadingParameters.bind(null, getState),
});
