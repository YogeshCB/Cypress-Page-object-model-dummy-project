import NetworksAccordion from '../../components/NetworksAccordion';
import profileSelectors from "../../store/objects/profile/selectors";
import profileOperations from "../../store/objects/profile/operations";
import { connect } from 'preact-redux';
import NetworkSettings from './networks/index';
import StoreResolver from '../../mixins/PropResolver';
import resolvers from './resolvers';
import config from '../../config';

export default connect(state => ({
  current: profileSelectors.getCurrentPublisher(state),
  ui: profileSelectors.getUIData(state),
  networks: profileSelectors.getNetworks(state),
  NetworkSettings,
  showNetworks: config.publisher.active,
}), {
  ...profileOperations,
  onOpenNetwork: profileOperations.onOpenNetwork.bind(null, 'publisher'),
})(StoreResolver(NetworksAccordion, {
  networks: resolvers.resolveNetworks.bind(null, config.publisher.labels),
}));