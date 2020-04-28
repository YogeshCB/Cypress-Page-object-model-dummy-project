import { h } from 'preact';
import styles from 'stylesheets/home';
import baseStyles from "@bit/kubric.components.styles.commons";
import appStyles from 'stylesheets/app';
import { CampaignCardPlaceholder } from "../../components/commons/Placeholders";

const getCampaignPlaceholders = () => {
  const results = [];
  for (let i = 0; i < 4; i++) {
    results.push(<CampaignCardPlaceholder theme={{ card: styles.cardPlaceholder }}/>);
  }
  return results;
};

export default ({ heading = true, theme = {} }) => (
  <div className={`${theme.container} ${styles.container}`}>
    {heading ? <div className={appStyles.pageheading}>Recent Campaigns</div> : <span/>}
    <div className={`${styles.campaigns} ${baseStyles.clearfix}`}>
      {getCampaignPlaceholders()}
    </div>
  </div>
)
;