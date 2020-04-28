import { h } from 'preact';
import styles from 'stylesheets/campaigns/index';
import Campaigns from './Campaigns';
import EmptyPage from '../../components/EmptyPage';
import NewCampaignButton from './campaigns/NewCampaignButton';

export default ({ count = 0, loading }) => (
  <span>
    <div className={styles.dashboard}>
      {count > 0 || loading ? (
          <div className={styles.content}>
            <Campaigns loading={loading}/>
          </div>
        ) :
        <EmptyPage heading="Welcome to Kubric" subheading="Let's begin by creating a campaign"
                   actions={[<NewCampaignButton/>]}/>}
    </div>
  </span>
);