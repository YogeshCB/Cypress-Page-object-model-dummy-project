import { connect } from 'preact-redux';
import Home from './home/index';
import homeCampaignsListPack from "../store/objects/lists/homecampaigns";
import StoreResolver from "../mixins/PropResolver";
import homeOperations from '../store/objects/home/operations';
import selectors from '../store/objects/home/selectors';

const StoreResolvedComponent = StoreResolver(Home, {
  campaigns({ campaignsById }) {
    return Object.keys(campaignsById).reduce((acc, id) => {
      acc.push(campaignsById[id]);
      return acc;
    }, [])
  },
});

export default connect(state => ({
  campaignsById: homeCampaignsListPack.selectors.getAllData(state),
  loading: selectors.isCampaignsLoading(state),
  isEmpty: selectors.isEmpty(state),
}), {
  ...homeOperations
})(StoreResolvedComponent);