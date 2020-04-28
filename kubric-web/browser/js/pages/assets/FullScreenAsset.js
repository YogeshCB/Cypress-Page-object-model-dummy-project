import { h } from 'preact';
import Fullscreen from './fullscreen/index';
import { connect } from 'preact-redux';
import assetActions from '../../store/objects/assets/actions';
import assetOperations from '../../store/objects/assets/operations';
import assetSelectors from '../../store/objects/assets/selectors';

export default connect(state => ({
  grid: assetSelectors.getGridStatus()
}), {
  ...assetActions,
  ...assetOperations,
})(Fullscreen);



