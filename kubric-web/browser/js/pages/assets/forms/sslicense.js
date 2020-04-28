import { h, Component } from 'preact';
import { PrimaryButton } from '../../../components/commons/misc';
import styles from 'stylesheets/assets/form';
import { Spinner } from "../../../components";
import downloadFile from 'downloadjs';
import appIcons from 'stylesheets/icons/app';

const getReadableDate = date => new Date(date).toLocaleString();

export default ({
                  subscriptions = [], licenseAsset, asset, selectSubscription, chosenSubscription,
                  loadingSubscription, licensedData
                }) => (
  <div className={styles.licenseForm}>
    {typeof licensedData === 'undefined' ? <h2>Select your Subscription</h2> : 
    <h2 className={styles.header}>
      <a onClick={()=>window.open(licensedData[0].download.url)}>Click to Download</a>
      &nbsp;<span className={`${appIcons.iconDownload} ${styles.icon}`}></span>
    </h2>}
    <div className={styles.subscriptions}>
    {typeof licensedData === 'undefined' ? loadingSubscription ?
      <Spinner theme={{ spinner: styles.subscriptionSpinner }}/> :
      subscriptions.length === 0 ? <h3>You have no Subscriptions</h3> : subscriptions.map((subscription, index) => {
        return <div className={`${styles.subscription} ${chosenSubscription === subscription.id ? styles.selectedSubscription : ''} `}
                    onClick={selectSubscription.bind(null, subscription.id)}>
          <h3>{subscription.description} &nbsp;&nbsp;&nbsp;
            <span>Expiration Time: {getReadableDate(subscription.expiration_time)}</span></h3>
          {subscription.allotment&&<p>Downloads Left: {subscription.allotment.downloads_left} &nbsp;&nbsp;&nbsp;
            Downloads Limit: {subscription.allotment.downloads_limit}</p>}
          <p>Formats: {subscription.formats.map((format, i) => {
            return `${format.description}${i === subscription.formats.length - 1 ? '' : ', '}`
          })} </p>
        </div>
      }) : ''}</div>
    <br/>

    <div className={styles.buttonLicense}>
    
    {typeof licensedData === 'undefined' ? subscriptions.length > 0 &&
      <PrimaryButton className={styles.confirmButton} isDisabled={typeof chosenSubscription === 'undefined'}
                     disabled={typeof chosenSubscription === 'undefined'}
                     onClick={licenseAsset.bind(null, asset.source_id, chosenSubscription, asset.asset_type)}>
        CONFIRM
      </PrimaryButton> : ''}
    </div>
  </div>
);