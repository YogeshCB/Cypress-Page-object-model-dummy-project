import Drive from './drive/index';
import networkOperations from "../../../store/objects/profile/operations/networks";
import profileSelectors from "../../../store/objects/profile/selectors";
import { connect } from 'preact-redux';

export default connect(state => ({
  ...profileSelectors.getNetwork('drive', state),
}), {
  ...networkOperations.drive,
})(Drive);