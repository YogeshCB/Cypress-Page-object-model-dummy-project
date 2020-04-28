import { h } from 'preact';
import styles from "stylesheets/messages";
import { Link } from "@bit/kubric.utils.common.router";
import { getCampaignUrl, getMessagesUrl } from "../../lib/links";
import Modal from '../../components/commons/Modal';
import { PrimaryButton } from '../../components/commons/misc';
import Preferences from './preferences';
import appIcons from 'stylesheets/icons/app';

const Message = ({ data = {}, onClick, theme = {} }) => {
  const { data: messageData = {} } = data;
  const { campaign, count, campaign_name: name } = messageData;
  return (
    <Link className={`${styles.message} ${theme.message}`} to={getCampaignUrl(campaign)} onClick={onClick.bind(null, data)}>
      <div className={styles.text}>
        <span className={styles.dark}>{count}</span>&nbsp; unread message{count>1?'s':''} in&nbsp; <span className={styles.dark}>{name}</span>
      </div>
    </Link>
  )
};

const messageFormatter = (data, theme) => {

  switch(data.notification_type) {
    case 'campaign_ad_approved': 
      const { what = {}, who } = data;
      return (<Link className={`${styles.message} ${theme.message}`} to={getCampaignUrl(what.campaign_id)}>
      <div className={styles.text}>
        <div className={`${appIcons.iconApproved} ${styles.icon}`}></div>&nbsp;
          <span className={styles.dark}>{who}</span>&nbsp;&nbsp; approved the ad <span className={styles.dark}>{what.ad_name}</span> in <span className={styles.dark}>{what.campaign_name}</span>
      </div>
      </Link>)
    default:
      return ''
  }
}

const CampaignNotification = ({ data = {}, theme }) => messageFormatter(data, theme);

export default props => {
  const { messages, onMessageClick, notifications, isPreferenceVisible, togglePreferences, theme = {}, showPreference = true } = props;
  const messageTags =  notifications.length === 0 && messages.results.length === 0 ? (
    <div className={`${styles.emptyPage} ${theme.emptyPage}`}>
      <div className={`${appIcons.notification} ${theme.notificationIcon}`} /> 
      <h3>Seems quiet around here.</h3>
      <p>When you get a notification it will show up here.</p>
    </div>
  ) : (
    <div className={`${styles.messages} ${theme.messages}`}>
      {messages.results.map(message => <Message theme={theme} data={message} onClick={onMessageClick}/>)}
      {notifications.map(message => <CampaignNotification theme={theme} data={message} onClick={onMessageClick}/>)}
    </div>
  );
  return (
    <div className={styles.container}>
      <div className={`${styles.header} ${theme.header}`}>    
        Notifications
        {showPreference  ? <PrimaryButton onClick={togglePreferences}>
        <span className={appIcons.iconSettingsTheme}></span>
        &nbsp;&nbsp;
        Preferences</PrimaryButton>:
        notifications.length > 0 || messages.results.length > 0?<Link to={getMessagesUrl()}>View All</Link>:''}  
      </div>
      <div className={styles.content}>      
        <div className={`${styles.messages} ${theme.messages}`}>
          {messageTags}
        </div>        
      </div>

      <Modal onHide={togglePreferences} theme={styles} visible={isPreferenceVisible}> 
        <Preferences {...props} />
      </Modal>
    </div>
  )
}