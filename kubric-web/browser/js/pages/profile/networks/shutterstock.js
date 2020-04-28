import Shutterstock from './shutterstock/index';
import { connect } from 'preact-redux';
import networkOperations from "../../../store/objects/profile/operations/networks";
import profileSelectors from "../../../store/objects/profile/selectors";

export default connect(state => ({
  ...profileSelectors.getNetwork('shutterstock', state),
}), {
  ...networkOperations.shutterstock,
})(Shutterstock);