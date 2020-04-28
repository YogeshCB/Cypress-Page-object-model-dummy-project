import { h } from 'preact';
import styles from 'stylesheets/content/index';
import Assets from '../utils/assets';
import NavPanel from './NavPanel';
import Notifier from '../../components/commons/Notifier';
import WorkspaceSelector from './WorkspaceSelector';

export default ({
                  pageData = {}, children, showAssets = false, notifications = [],
                  onNotificationClosed, workspace_id
                }) => {
  let { theme = {} } = pageData;

  return (
    <div className={`${theme.content || ''} ${styles.content} ${styles.hasNavPanel}`}>
      {workspace_id ? <NavPanel/> : <span/>}
      {workspace_id ? null : <WorkspaceSelector/>}
      {workspace_id ? children : <span/>}
      {showAssets ? <Assets multipleUpload={true}/> : <span/>}
      {notifications.length > 0 ? <Notifier notifications={notifications} onClose={onNotificationClosed}/> : <span/>}
    </div>
  );
};
