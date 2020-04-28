import NetworksAccordion from '../../components/NetworksAccordion';
import profileOperations from "../../store/objects/profile/operations";
import cloudinaryOperations from '../../store/objects/profile/operations/networks/cloudinary';
import profileSelectors from "../../store/objects/profile/selectors";
import pickerOperations from "../../store/objects/picker/operations";
import pickerSelectors from "../../store/objects/picker/selectors";
import { connect } from 'preact-redux';
import NetworkSettings from './networks/index';
import StoreResolver from '../../mixins/PropResolver';
import resolvers from './resolvers';
import config from '../../config';

export default connect(state => ({
  current: profileSelectors.getCurrentAssetNetwork(state),
  ui: profileSelectors.getUIData(state),
  networks: profileSelectors.getNetworks(state),
  NetworkSettings,
  showNetworks: config.assets.networks.active,
  isPickerOpen: pickerSelectors.isPickerOpen()
}), {
  ...profileOperations,
  ...cloudinaryOperations,
  ...pickerOperations,
  onOpenNetwork: profileOperations.onOpenNetwork.bind(null, 'asset'),
})(StoreResolver(NetworksAccordion, {
  networks: resolvers.resolveNetworks.bind(null, config.assets.networks.labels),
}));