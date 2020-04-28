import { h } from 'preact';
import styles from 'stylesheets/components/commons/notifier';
import fontIcons from 'stylesheets/icons/fonticons';

const Notification = ({ type = 'error', heading, desc, id, onClose }) => (
  <div className={`${styles.notification} ${styles[type]}`}>
    <div className={`${styles.details} ${styles[type]}`}>
      <div className={`${styles.typeIcon} ${styles[type]}`}/>
      <div className={styles.message}>
        {heading ? <div className={`${styles.heading} ${styles[type]}`}>{heading}</div> : <span/>}
        {desc ? <div className={styles.desc}>{desc}</div> : <span/>}
      </div>
    </div>
    <div className={`${styles.close} ${styles[type]} ${fontIcons.fonticonClose}`} onClick={onClose}/>
  </div>
);

export default ({ notifications = [], onClose }) => (
  notifications.length > 0 ? (
    <div className={styles.notifier}>
      {
        notifications.map(notification => <Notification {...notification} key={notification.id}
                                                        onClose={() => onClose && onClose(notification.id)}/>)
      }
    </div>
  ) : <span/>
);