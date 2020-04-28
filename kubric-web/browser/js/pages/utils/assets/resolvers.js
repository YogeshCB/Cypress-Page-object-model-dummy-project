import { arrayToMap } from "@bit/kubric.utils.common.lodash";
import { getByIds } from "@bit/kubric.redux.state.utils";


const getSelectedAssets = (allIds = [], selectedIds = []) => {
  const selectedMap = arrayToMap(selectedIds);
  return allIds.reduce((acc, id, index) => {
    selectedMap[id] && acc.push(index);
    return acc;
  }, []);
};

const getAssetsData = ({ byId = {}, selected = [], currentQueryData = {} }) => {
  return ({
    selected: getSelectedAssets(currentQueryData.results, selected),
    assets: getByIds(byId, currentQueryData.results),
  });
};


export default {
  getAssetsData,
};

