import Parameters from './editor/index';
import { connect } from "preact-redux";
import pickerOperations from '../../../store/objects/picker/operations';
import pickerSelectors from '../../../store/objects/picker/selectors';
import creativeSelectors from '../../../store/objects/campaign/creative/selectors';
import creativeOperations from '../../../store/objects/campaign/creative/operations';
import PropResolver from "../../../mixins/PropResolver";
import bulkEditSelectors from "../../../store/objects/campaign/bulkedit/selectors";
import bulkEditOperations from "../../../store/objects/campaign/bulkedit/operations";
import { bindingsResolver, metaResolver } from "../resolvers";

export const SingleEditor = connect(state => ({
  parameters: creativeSelectors.getCurrentParameters(state),
  loading: creativeSelectors.getCurrentLoadingParameters(state),
  bindings: creativeSelectors.getBindings(state),
  creativeView: true,
  selected: creativeSelectors.getCurrentEditorShot(state),
  isPickerOpen: pickerSelectors.isPickerOpen(state),
  meta: creativeSelectors.getEditorMeta(state)
}), {
  ...pickerOperations,
  ...creativeOperations,
})(Parameters);

const PropResolvedBulkEditor = PropResolver(Parameters, {
  bindings: bindingsResolver,
  meta: metaResolver
});

export const BulkEditor = connect(state => ({
  parameters: bulkEditSelectors.getCurrentParameters(state),
  allParameters: bulkEditSelectors.getParameters(state),
  allBindings: bulkEditSelectors.getBindings(state),
  metaString: bulkEditSelectors.getEditorMeta(state),
  creativeView: true,
  isPickerOpen: pickerSelectors.isPickerOpen(state),
  selected: bulkEditSelectors.getSelectedShot(),
  currentCreative: bulkEditSelectors.getCurrentCreative(),
  suggest: false
}), {
  ...pickerOperations,
  ...bulkEditOperations
})(PropResolvedBulkEditor);