import { h } from 'preact';
import SelectBox from '../../../../components/commons/SelectBox';
import styles from 'stylesheets/profile/networks/facebook/index';
import PermissionsModal from './PermissionsModal';
import { SecondaryButton } from "../../../../components/commons/misc";

const getOptions = arr => arr.map(({ id, name }) => ({
  value: id,
  label: name,
  data: {
    id,
    name,
  }
}));

export default ({ data = {}, onChange, uiData = {}, onUIChange, onConfirm, onUnlink }) => {
  const { adaccounts = [], adaccount = {}, businesses = [], business = {} } = data;
  const { showPermissionsModal = false } = uiData;
  return (
    <div className={styles.facebook}>
      {adaccounts.length === 0 ? (
        <div>
          The linked Facebook account does not have any Ad Accounts in it. Kubric needs an ad account to be linked to
          your profile for publishing ads. Please create an ad account in the linked facebook account and then add it
          here or click the UNLINK button below and link again to another facebook account that has ad accounts in it.
        </div>
      ) : (
        <div className={styles.content}>
          <SelectBox hint='Ad Account' options={getOptions(adaccounts)} value={adaccount.id}
                     theme={styles} onChange={(value, name, data) => onChange(name, data)} name='adaccount'/>
        </div>
      )}
      <SecondaryButton onClick={onUnlink} className={styles.button}>Unlink</SecondaryButton>
      {showPermissionsModal ? <PermissionsModal onCancel={onUIChange.bind(null, {
        showPermissionsModal: false,
      })} onConfirm={onConfirm}/> : <span/>}
    </div>
  );
};