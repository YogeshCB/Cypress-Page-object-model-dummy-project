import { connect } from 'preact-redux';
import Storyboards from './storyboards/index';
import campaignActions from "../../store/objects/campaign/actions";
import DataFetcher, { getFetcherHandlers, getServiceHandler } from '../../mixins/DataFetcher';
import StoreResolver from '../../mixins/PropResolver';
import services from '../../services';
import storyboardListPack from '../../store/objects/campaign/storyboards/reducer/list';

const storyboardListSelectors = storyboardListPack.selectors;

const DataFetchedComponent = DataFetcher({
  object: 'storyboards',
  component: Storyboards,
  fetcher: {
    service: getServiceHandler(services.storyboards.get),
    ...getFetcherHandlers(campaignActions.storyboardsFetched),
  },
});

const StoreResolvedComponent = StoreResolver(DataFetchedComponent, {
  data: storyboardListPack.resolvers.getListData,
});

export default connect(state => ({
  storyboardsByIds: storyboardListSelectors.getAllData(),
  storyboardIds: storyboardListSelectors.getCurrentFilterResults(),
  filters: storyboardListSelectors.getFilters(),
  query: storyboardListSelectors.getFiltersAsQuery(),
  loading: storyboardListSelectors.isQueryFilterLoading(),
  completed: storyboardListSelectors.isQueryFilterCompleted(),
  selected: storyboardListSelectors.getSelectedIds(),
}), {
  ...storyboardListPack.operations,
})(StoreResolvedComponent);