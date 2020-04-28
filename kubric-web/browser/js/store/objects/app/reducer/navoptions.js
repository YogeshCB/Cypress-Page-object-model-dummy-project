import {
  APPS_ROUTE, ASSET_ROUTE,
  ASSETS_ROUTE, BANNERS_ROUTE,
  CAMPAIGNS_ROUTE,
  CATALOGUE_ROUTE,
  FEEDCARDS_ROUTE,
  HOME_ROUTE, MESSAGES_ROUTE,
  SOURCING_ROUTE
} from "../../../../routes";
import types from "../types";
import { getAssetsUrl, getCampaignUrl, getStudioUrl } from "../../../../lib/links";

const updateOption = (state, value, options = [], linkFn, optionValue) =>
  state.map(option => option.value !== value ? option : {
    ...option,
    options: options.map(({ name, uid }) => ({
      label: name,
      value: optionValue,
      link: linkFn(uid),
      uid
    })),
  });

const options = [{
  label: 'Recent',
  value: HOME_ROUTE,
  loading: true,
  link: '/home',
}, {
  label: 'Gallery',
  value: ASSETS_ROUTE,
  loading: true,
  link: '/userassets',
}, {
  label: 'Apps',
  value: APPS_ROUTE,
  link: '/apps',
  options: [{
    label: 'Marketing',
    value: CAMPAIGNS_ROUTE,
    link: '/campaigns',
  }, {
    label: 'Product Videos',
    value: CATALOGUE_ROUTE,
    link: '/catalogue',
  }, {
    label: 'Feed Cards',
    value: FEEDCARDS_ROUTE,
    link: '/feedcards',
  }, {
    label: 'Banners',
    value: BANNERS_ROUTE,
    link: '/banners',
  }, {
    label: 'Image Bank',
    value: SOURCING_ROUTE,
    link: '/sourcing',
  }]
}, {
  label: 'Studio',
  value: 'studio',
  link: getStudioUrl(),
}];

const setLoading = (state, value = [], loading = false) => {
  if (!Array.isArray(value)) {
    value = [value];
  }
  return state.map(option => {
    if (value.indexOf(option.value) > -1) {
      return {
        ...option,
        loading,
      };
    }
    return option;
  });
};

export default (state = options, action = {}) => {
  switch (action.type) {
    case types.APP_LOADED:
      return setLoading(state, [HOME_ROUTE, ASSETS_ROUTE], true);
    case types.RECENT_CAMPAIGNS_UPDATED: {
      const newState = setLoading(state, HOME_ROUTE);
      return updateOption(newState, HOME_ROUTE, action.payload, getCampaignUrl, CAMPAIGNS_ROUTE);
    }
    case types.RECENT_ASSETS_UPDATED: {
      const newState = setLoading(state, ASSETS_ROUTE);
      return updateOption(newState, ASSETS_ROUTE, action.payload, getAssetsUrl, ASSET_ROUTE);
    }
    default:
      return state;
  }
};
