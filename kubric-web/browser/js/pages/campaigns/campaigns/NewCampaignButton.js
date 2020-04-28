import { h, Component } from 'preact';
import styles from 'stylesheets/campaigns/campaigns';
import { PrimaryButton } from "../../../components/commons/misc";
import NewCampaignModal from './NewCampaignModal';
import campaignOperations from '../../../store/objects/campaign/operations';
import { connect } from "preact-redux";

const Button = ({ onNewCampaign }) => (
  <div>
    <PrimaryButton className={styles.create} onClick={onNewCampaign}>+ New Campaign</PrimaryButton>
    <NewCampaignModal/>
  </div>
);

export default connect(state => ({}), {
  ...campaignOperations
})(Button);
