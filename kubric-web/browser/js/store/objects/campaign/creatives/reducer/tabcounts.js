import campaignTypes from "../../types";
import { creativeTabs } from "../../../../../../../isomorphic/constants/creatives";
import creativesListPack from "../../creatives/list";
import { selectors } from "@bit/kubric.redux.packs.list";
import { getVisibleFilterSet } from "../utils";

const showFilterTab = ({ data: creatives = {} } = {}) => {
  const { selected: selectedFilters = [], source: filterSource = [] } = selectors.getFilters(creatives) || {};
  const visibleFilterSet = getVisibleFilterSet(filterSource);
  return selectedFilters.some(({ id }) => visibleFilterSet.has(id));
};

const DEFAULT_STATE = {
  [creativeTabs.FILTERED]: 0,
  [creativeTabs.ALL]: 0,
  [creativeTabs.INPROGRESS]: 0,
  [creativeTabs.FAILED]: 0,
  [creativeTabs.READY]: 0,
  [creativeTabs.GENERATED]: 0,
  [creativeTabs.PUBLISHED]: 0
};

export default (state = { ...DEFAULT_STATE }, action) => {
  switch (action.type) {
    case campaignTypes.STATS_FETCHED: {
      const stats = action.payload;
      const { inprogress = {}, failed = {} } = stats;
      const filterTabVisible = showFilterTab(state);
      return {
        ...state,
        activeTab: filterTabVisible ? creativeTabs.FILTERED : state.activeTab,
        tabcounts: {
          [creativeTabs.FILTERED]: filterTabVisible ? 1 : 0,
          [creativeTabs.ALL]: stats.all || 0,
          [creativeTabs.INPROGRESS]: inprogress.all || 0,
          [creativeTabs.FAILED]: failed.all || 0,
          [creativeTabs.READY]: stats.ready || 0,
          [creativeTabs.GENERATED]: stats.generated || 0,
          [creativeTabs.PUBLISHED]: stats.published || 0
        }
      };
    }
    case creativesListPack.types.CLEAR_SELECTED_FILTERS:
      return {
        ...state,
        activeTab: creativeTabs.ALL,
        tabcounts: {
          ...state.tabcounts,
          [creativeTabs.FILTERED]: 0,
        }
      };
    case creativesListPack.types.FILTER_SELECTED:
    case creativesListPack.types.FILTER_DELETED: {
      const { id } = action.payload;
      if (id !== 'tabs') {
        const filterTabVisible = showFilterTab(state);
        return {
          ...state,
          activeTab: filterTabVisible ? creativeTabs.FILTERED : creativeTabs.ALL,
          tabcounts: {
            ...state.tabcounts,
            [creativeTabs.FILTERED]: filterTabVisible ? 1 : 0,
          }
        };
      }
    }
    default:
      return state;
  }
};