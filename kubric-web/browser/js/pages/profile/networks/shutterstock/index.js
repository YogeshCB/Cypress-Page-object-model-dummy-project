import { h } from 'preact';
import Field from '../../../../components/commons/Field';
import styles from 'stylesheets/profile/networks/cloudinary';
import { SecondaryButton, StaticField } from "../../../../components/commons/misc";
import baseStyles from '@bit/kubric.components.styles.commons';

export default ({ onSyncFolder, lastSynced, onUnlink, isConnected }) => {
  return (
    <div className={`${styles.cloudinary} ${baseStyles.clearfix}`}>
    {typeof lastSynced !== 'undefined' ? <StaticField label="Last synced on" value={lastSynced}/> : <span/>}
      {isConnected? [<SecondaryButton className={styles.button} onClick={onSyncFolder.bind(null,'shutterstock')}>Sync Now</SecondaryButton>
      ,<SecondaryButton className={styles.button} onClick={onUnlink}>Unlink</SecondaryButton>]: ''}
    </div>
  );
}