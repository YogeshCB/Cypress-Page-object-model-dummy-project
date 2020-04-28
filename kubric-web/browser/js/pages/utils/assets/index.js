import { connect } from 'preact-redux';
import services from "../../../services";
import assetResolvers from './resolvers';
import Assets from '../../../components/Assets';
import DataFetcher, { getServiceHandler } from '../../../mixins/DataFetcher';
import StoreResolver from '../../../mixins/PropResolver';
import assetListPack from '../../../store/objects/lists/assets';
import assetSelectors from '../../../store/objects/assets/selectors/index';
import assetOperations from '../../../store/objects/assets/operations';
import attributeActions from "../../../store/objects/attributes/actions";
import attributeSelectors from "../../../store/objects/attributes/selectors";

const DataFetchedComponent = DataFetcher({
  component: Assets,
  object: 'assets',
  objects: {
    attributes: {
      service: getServiceHandler(services.segments.getAttributes),
      onFetched(res) {
        store.dispatch(attributeActions.attributesFetched(res));
      },
      shouldAvoidFetching() {
        return attributeSelectors.getAllIds().length > 0;
      },
    },
  }
});

const StoreResolvedComponent = StoreResolver(DataFetchedComponent, {
  data: assetResolvers.getAssetsData,
});

export default connect(state => {
  return {
    query: assetListPack.selectors.getCurrentQuery(),
    searchable: true,
    byId: assetListPack.selectors.getAllForFilterQuery('id'),
    filters: assetListPack.selectors.getFilters(),
    loading: assetListPack.selectors.isQueryFilterLoading(),
    completed: assetListPack.selectors.isQueryFilterCompleted(),
    filterString: assetListPack.selectors.getFiltersAsQuery(),
    selected: assetListPack.selectors.getSelectedIds(),
    currentQueryData: assetListPack.selectors.getCurrentFilterData(),
    path: assetSelectors.getPath(),
    folder: assetSelectors.getFolderData(),
    names: assetSelectors.getNames(),
  }
}, {
  ...assetOperations,
})(StoreResolvedComponent);