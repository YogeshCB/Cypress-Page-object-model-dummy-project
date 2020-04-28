import { h } from 'preact';
import styles from 'stylesheets/profile/networks/facebook/permissions';
import ConfirmationDialog from '../../../../components/commons/ConfirmationDialog';

export default ({ onCancel, onConfirm }) => (
  <ConfirmationDialog visible={true} onCancel={onCancel} onConfirm={onConfirm}>
    <div>Kubric needs the following permissions to enable publishing ads to Facebook</div>
    <ol>
      <li className={styles.listEntry}>
        Access to read your list of pages - Every facebook ad needs to be associated with a valid facebook page.
        Kubric needs to know the list of pages associated with your ad-account so that it can publish the generated
        video-ads to your ad-account's relevant associated page.
      </li>
      <li>
        Access to manage your ad account - Kubric needs this permission to create your ad campaigns, ad sets, ads
        etc. in facebook
      </li>
    </ol>
  </ConfirmationDialog>
);