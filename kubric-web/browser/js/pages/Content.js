import Content from './content/index';
import { connect } from 'preact-redux';
import assetSelectors from '../store/objects/assets/selectors/index';
import userSelectors from '../store/objects/user/selectors';
import notificationSelectors from "../store/objects/notifications/selectors";
import notificationOperations from "../store/objects/notifications/operations";
import PropResolver from '../mixins/PropResolver';
import { getAllByIds } from "@bit/kubric.redux.state.utils";

const PropResolvedComponent = PropResolver(Content, {
  notifications({ notificationsState }) {
    return getAllByIds(notificationsState);
  }
});

export default connect(state => ({
  showAssets: assetSelectors.isAssetsVisible(state),
  notificationsState: notificationSelectors.getState(state),
  workspace_id: userSelectors.getWorkspaceId(state)
}), {
  ...notificationOperations,
})(PropResolvedComponent);
