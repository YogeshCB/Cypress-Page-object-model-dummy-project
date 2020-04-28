import { h } from 'preact';
import { Menu, MenuItem } from '../../../../components/commons/Menu';
import { ProfileAvatar } from '../../../../components/commons/misc';
import styles from 'stylesheets/content/headermenu';
import Workspace from './Workspace';
import InitialIcon from '../../../../components/commons/InitialIcon';

const Avatar = props => {
  const { user = {}, profile = {} } = props;
  const { settings = {}, name } = user;
  const { org = {} } = settings;
  const { name: orgName } = org;
  const { account = {} } = profile;
  return (
    <div className={styles.avatar}>
      <ProfileAvatar name={name} pic={user.photo || account.profile_image_url}/>
      {orgName ? <div className={styles.org}>{orgName}</div> : <div className={styles.org}>{name}</div>}
    </div>
  )
};

const WorkspaceName = ({ name, user }) => (
  <div className={styles.workspace}>
    <InitialIcon name={name} theme={{ icon: styles.wsIcon }} randomizeColor={false}/>
  </div>
);

export default ({ workspaceData, onProfileClick, onManageWorkspace, onLogout, user = {}, profile }) => (
  <Menu iconElement={<WorkspaceName user={user.name} {...workspaceData}/>} theme={styles}>
    <MenuItem className={styles.nameMenu} theme={styles}>
      <Avatar user={user} profile={profile}/>
    </MenuItem>
    <MenuItem className={styles.profileMenu} theme={styles} onClick={onProfileClick}>
      Profile & Account
    </MenuItem>
    <MenuItem className={styles.logout} theme={styles} onClick={onManageWorkspace}>
      Manage workspace
    </MenuItem>
    <MenuItem onClick={onLogout} theme={styles}>Sign out</MenuItem>
    <Workspace/>
  </Menu>
);