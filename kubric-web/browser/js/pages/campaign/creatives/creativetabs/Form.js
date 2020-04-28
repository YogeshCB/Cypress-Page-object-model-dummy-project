import Form from './form/index';
import { connect } from "preact-redux";
import creativesSelectors from "../../../../store/objects/campaign/creatives/selectors";
import creativesListPack from "../../../../store/objects/campaign/creatives/list";
import creativesOperations from "../../../../store/objects/campaign/creatives/operations";
import creativeOperations from "../../../../store/objects/campaign/creative/operations";
import chatOperations from "../../../../store/objects/chat/operations";
import PropResolver from "../../../../mixins/PropResolver";
import userSelectors from "../../../../store/objects/user/selectors";
import { isKubricUser } from "../../../../lib/utils";

const ResolvedComponent = PropResolver(Form, {
  data: creativesListPack.resolvers.getListData,
  isSelectedDirty: creativesListPack.resolvers.getIsSelectedDirty,
});

export default connect(state => ({
  formData: creativesSelectors.getFormData(state),
  creatives: creativesListPack.selectors.getCurrentFilterResults(),
  selected: creativesListPack.selectors.getSelectedIds(state),
  selectedRows: creativesListPack.selectors.getSelectedRows(state),
  gridImage: creativesSelectors.getGridStatus(state),
  showInferred: isKubricUser(userSelectors.getUserEmail(state)),
  tab: creativesSelectors.getPanelTab(state)
}), {
  ...creativesOperations,
  ...creativeOperations,
  ...chatOperations
})(ResolvedComponent);