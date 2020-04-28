import { connect } from 'preact-redux';
import NavPanel from './navpanel/index';
import userSelectors from '../../store/objects/user/selectors';
import appSelectors from '../../store/objects/app/selectors';
import appOperations from '../../store/objects/app/operations';
import messagesListPack from "../../store/objects/messages/list";

export default connect(state => ({
  selected: appSelectors.getNavSelected(),
  options: appSelectors.getNavOptions(),
  email: userSelectors.getUserEmail(),
  workspace_id: userSelectors.getWorkspaceId(),
  notifications: messagesListPack.selectors.getCurrentFilterResults()
}), {
  ...appOperations
})(NavPanel);