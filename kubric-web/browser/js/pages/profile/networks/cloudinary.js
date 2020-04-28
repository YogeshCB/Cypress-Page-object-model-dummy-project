import { h } from 'preact';
import Field from '../../../components/commons/Field';
import styles from 'stylesheets/profile/networks/cloudinary';
import { SecondaryButton } from "../../../components/commons/misc";
import baseStyles from '@bit/kubric.components.styles.commons';
import CloudinaryFilePicker from '../../../components/commons/CloudinaryPicker';

export default ({ onChange, data = {}, onConfirm, pickerCallback, onUnlink, isConnected, pickAsset, isPickerOpen }) => {
  const { api_key: apiKey, api_secret: apiSecret, cloud_name: cloudName, connected } = data;

  return (
    <div className={`${styles.cloudinary} ${baseStyles.clearfix}`}>
      <input type="hidden" value="some"/>
      <Field label="API Key" value={apiKey} onChange={onChange.bind(null, 'api_key')}/>
      <Field label="API Secret" autoComplete="new-password" type="password" value={apiSecret} onChange={onChange.bind(null, 'api_secret')}/>
      <Field label="Cloud Name" value={cloudName} onChange={onChange.bind(null, 'cloud_name')}/>
      {(isConnected || connected) && <CloudinaryFilePicker isPickerOpen={isPickerOpen} onAddFolder={pickerCallback} pickAsset={pickAsset} data={data}  />}
      {(isConnected || connected)? <SecondaryButton className={`${styles.button} ${styles.danger}`} onClick={onUnlink}>Unlink</SecondaryButton>:
      <SecondaryButton className={styles.button} onClick={onConfirm}>Link Account</SecondaryButton>}   
    </div>
  );
}