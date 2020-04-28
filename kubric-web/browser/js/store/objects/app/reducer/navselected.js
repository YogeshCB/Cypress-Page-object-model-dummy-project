import {
  APPS_ROUTE, ASSET_ROUTE,
  ASSETS_ROUTE, BANNERS_ROUTE,
  CAMPAIGNS_ROUTE,
  CATALOGUE_ROUTE, CREATED_CAMPAIGN_ROUTE,
  FEEDCARDS_ROUTE,
  HOME_ROUTE
} from "../../../../routes";
import selectors from "../selectors";
import routeTypes from "../../route/types";
import types from "../types";
import routeSelectors from "../../route/selectors";

const routeMap = {
  [HOME_ROUTE]: [0],
  [ASSETS_ROUTE]: [1],
  [APPS_ROUTE]: [2],
  [CAMPAIGNS_ROUTE]: [2, 0],
  [CATALOGUE_ROUTE]: [2, 1],
  [FEEDCARDS_ROUTE]: [2, 2],
  [BANNERS_ROUTE]: [2, 3]
};

const getNavIndex = (option, subOptionId) => {
  const navOptions = selectors.getNavOptions();
  const mainIndex = navOptions.findIndex(({ value }) => value === option);
  const { options: subOptions = [] } = navOptions[mainIndex];
  let subIndex = subOptions.findIndex(subOption => subOption.uid === subOptionId);
  return subIndex >= 0 ? [mainIndex, subIndex] : [];
};

const getNavSelected = (routeId, params) => {
  if (routeMap[routeId]) {
    return routeMap[routeId];
  } else if (routeId === CREATED_CAMPAIGN_ROUTE) {
    const { campaign } = params;
    return getNavIndex(HOME_ROUTE, campaign);
  } else if (routeId === ASSET_ROUTE) {
    const { folderId } = params;
    return getNavIndex(ASSETS_ROUTE, folderId);
  }
  return [];
};

export default (state = [], action) => {
  switch (action.type) {
    case routeTypes.ROUTE_LOADED:
      const { routeId, location = {} } = action.payload;
      const { params = {} } = location;
      return getNavSelected(routeId, params);
    case types.UPDATE_SELECTED_NAV:
      return getNavSelected(routeSelectors.getRouteId(), routeSelectors.getRouteParams());
    default:
      return state;
  }
};