import services from "../../../services";
import pickerActions from './actions';
import assetActions from '../assets/actions';
import assetListPack from '../lists/assets/index';
import { prefetchedHandlers, postFetchHandlers, getServiceData } from './utils';
import assetSelectors from '../assets/selectors/index';
import pickerSelectors from './selectors';

const pickAsset = ({ network = 'kubric', single = true, type = 'image', callback, ...meta }) => dispatch => {
  assetListPack.operations.onPurgeList()(dispatch);
  prefetchedHandlers[network] && dispatch(prefetchedHandlers[network](type, meta));

  dispatch(assetActions.disallowExactPath());

  const serviceData = getServiceData[network](type, meta);
  dispatch(pickerActions.pickAsset({ network, single, type, callback }));
  services.assets.getAssets()
    .notifyStore()
    .send({
      context: network,
      ...serviceData
    })
    .then(res => {
      dispatch(postFetchHandlers[network](res, meta, type));
    })
};


const onAssetSelection = () => dispatch => {
  const callback = pickerSelectors.getCallback();
  const assets = assetListPack.selectors.getSelectedIds().map(asset => {
    return assetSelectors.getAsset(asset);
  });
  dispatch(closePicker());
  dispatch(callback(assets));
};

const onAssetClick = ({
                        type,
                        asset_type,
                        id
                      }, e) => dispatch => {
  const pickerConfig = pickerSelectors.getPickerConfig();
  const asset = assetListPack.selectors.getById(id);
  if (pickerConfig.single && asset.asset_type === pickerConfig.type) {
    dispatch(assetListPack.operations.onClearRowSelections());
    dispatch(assetListPack.operations.onRowSelected({ id }));
  } else if (asset.asset_type === pickerConfig.type) {
    dispatch(assetListPack.operations.onRowSelected({ id }));
  }
};

const closePicker = () => dispatch => {
  dispatch(assetListPack.operations.onClearRowSelections());
  dispatch(pickerActions.pickAsset());
};

export default {
  pickAsset,
  closePicker,
  onAssetClick,
  onAssetSelection
}