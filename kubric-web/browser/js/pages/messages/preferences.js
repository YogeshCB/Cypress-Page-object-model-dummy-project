import { h } from 'preact';
import styles from "stylesheets/messages";
import { Toggle } from '../../components/commons/Toggle';


const Permission = ({ values, onChange, label, description, subscriptions, notification_type, subscriber, subscribed }) => {
  
  return (<div className={styles.permission}>
        <div className={`${styles.preference}`}>
          <h3>{label}</h3>
          <span className={styles.description}>{description}</span>
        </div>
        {Object.keys(subscriptions.channels).map(channel=> {
          let payload = { subscriber, active: values[channel]?0:1, channel, notification_type }
          subscribed.map(sub=> {
            if (sub.channel === channel) {
              payload = {
                ...payload,
                uid: sub.uid
              }
            }
          })

          return <div className={styles.value}>
            <Toggle 
              hideLabel={true} 
              theme={styles}
              value={values[channel]} 
              onValue={true}
              offValue={false} 
              onChange={onChange.bind(null, payload)} 
            />
          </div>
        })}
      </div>)
}


export default ({ subscriptions, notificationConfig, onPreferenceChange, email }) => {
  const notificationTypes = notificationConfig['notification-type'];
  const preferences = Object.keys(notificationTypes).map(preference => {
    return {
      ...notificationTypes[preference],
      notification_type: preference
    }
  })
  let values = {};

  Object.keys(notificationConfig.channels).map(channel=>{
    values = {
      ...values,
      [channel]: false
    }
  })

    return  <div className={styles.permissions}>
    <div className={styles.preferenceHeader}>
      <h3 className={styles.preference}>Preferences</h3>
      {Object.keys(notificationConfig.channels).map(channel=>{
        return <h3 className={styles.value}>{notificationConfig.channels[channel]}</h3>
      })}
    </div>
    {preferences.map(preference => {
      subscriptions.map(subscription => {
        if(subscription.active === 1 && Object.keys(notificationConfig.channels).indexOf(subscription.channel)>-1) {
          values = {
            ...values,
            [subscription.channel]: true
          }
        }
      })

      return <Permission 
          label={preference.label} 
          description={preference.description} 
          values={values}
          subscriber={email}
          subscriptions={notificationConfig}
          subscribed={subscriptions}
          onChange={onPreferenceChange} 
          notification_type={preference.notification_type}
        />
    })}
  </div>
}