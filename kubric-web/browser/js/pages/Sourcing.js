import Sourcing from "./sourcing/index";
import sourcingActions from "../store/objects/sourcing/actions";
import sourcingSelectors from "../store/objects/sourcing/selectors";
import sourcingListPack from "../store/objects/lists/sourcing";
import { connect } from "preact-redux";
import StoreResolver from "../mixins/PropResolver";
import DataFetcher, { getServiceHandler, getFetcherHandlers } from "../mixins/DataFetcher";
import services from "../services";
import store from "../store";

export const routeUnloaded = () => sourcingListPack.operations.onPurgeList()(store.dispatch);

const StoreResolvedComponent = StoreResolver(Sourcing, {
	imageBank: sourcingListPack.resolvers.getListData
});

export default connect(
	state => ({
		loading: sourcingSelectors.getLoading(state),
		myImageBank: sourcingListPack.selectors.getState(),
		results: sourcingListPack.selectors.getCurrentFilterData(),
		selectedIds: sourcingListPack.selectors.getSelectedIds(),
		selectedImages: sourcingListPack.selectors.getSelectedRows(),
		page: sourcingSelectors.getPage(),
		range: sourcingSelectors.getRange()
	}),
	{
		...sourcingActions,
		...sourcingListPack.operations,
		...sourcingListPack.actions
	}
)(
	DataFetcher({
		object: "sourcing",
		component: StoreResolvedComponent,
		fetcher: {
			service: getServiceHandler(services.sourcing.getImageBank),
			...getFetcherHandlers(sourcingActions.getImageBank)
		}
	})
);
