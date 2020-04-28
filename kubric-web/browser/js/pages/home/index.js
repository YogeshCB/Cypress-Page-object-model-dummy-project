import { h } from 'preact';
import styles from 'stylesheets/home';
import baseStyles from "@bit/kubric.components.styles.commons";
import { capitalize } from "@bit/kubric.utils.common.lodash";
import appStyles from 'stylesheets/app';
import PlaceHolders from './placeholders';

const statusMap = {
  "adcreation-inprogress": "Resolving assets",
  "created": "Assets resolution completed",
  "adcreation-erred": "Missing assets",
  "generation-inprogress": "Generating creatives",
  "generation-erred": "Creative generation failed",
  "generation-completed": "Creatives generated"
};

const getStatusClass = status => /-inprogress/.test(status) ? 'inprogress' : (/-erred/.test(status) ? 'erred' : 'completed');

const CampaignCard = ({ uid, onSelected, name, mediaFormat, ads_count, desc, updatedOnString, status }) => {
  const formatString = capitalize(mediaFormat) || '';
  return (
    <div className={styles.card} onClick={onSelected}>
      <div className={styles.title}>{name}</div>
      {formatString.length > 0 ? <div className={styles.subtitle}>{`${formatString} campaign`}</div> : <span/>}
      <div className={styles.fields}>
        <div className={styles.field}>
          <span className={styles.label}>No. of creatives: </span>
          <span className={styles.value}>{ads_count}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Created on: </span>
          <span className={styles.value}>{desc}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Last updated: </span>
          <span className={styles.value}>{updatedOnString}</span>
        </div>
        <div className={`${styles.field} ${styles[getStatusClass(status)]}`}>
          <span className={styles.label}>Status: </span>
          <span className={styles.value}>{statusMap[status]}</span>
        </div>
      </div>
    </div>
  );
};

const getCampaigns = (campaigns = [], onCampaignSelected) => campaigns.map(campaign => <CampaignCard {...campaign}
                                                                                                     onSelected={onCampaignSelected.bind(null, campaign.uid)}/>);
export default ({ campaigns, loading = true, onCampaignSelected, isEmpty }) => (
  <div className={styles.container}>
    <div className={appStyles.pageheading}>Recent Campaigns</div>
    <div className={`${styles.campaigns} ${baseStyles.clearfix}`}>
      {isEmpty ? <span>You have no recent campaigns</span> : (loading ? <PlaceHolders heading={false}
                                                                                      theme={{ container: styles.pcContainer }}/> : getCampaigns(campaigns, onCampaignSelected))}
    </div>
  </div>
);