import { h } from 'preact';
import { StaticField } from "../../../../components/commons/misc";
import DriveFilePicker from "../../../../components/commons/DrivePicker";
import { SecondaryButton } from "../../../../components/commons/misc";
import styles from 'stylesheets/profile/networks/drive';
import baseStyles from '@bit/kubric.components.styles.commons';

export default ({ folders = [], email, token, onDeleteFolder, onAddFolder, onUnlink, scopes, client_id, lastSynced }) => (
  <div className={baseStyles.clearfix}>
    <StaticField label="Linked Google user" value={email}/>
    {typeof lastSynced !== 'undefined' ? <StaticField label="Last synced on" value={lastSynced}/> : <span/>}
    <DriveFilePicker client_id={client_id} scopes={scopes} folders={folders} onDeleteFolder={onDeleteFolder} onAddFolder={onAddFolder} accessToken={token}/>
    <SecondaryButton className={styles.button} onClick={onUnlink}>Unlink</SecondaryButton>
  </div>
);