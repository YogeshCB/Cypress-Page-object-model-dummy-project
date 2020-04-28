import { h } from 'preact';
import styles from 'stylesheets/components/dotloader';

export default ({ theme = {} }) => (
  <span className={`${styles.container} ${theme.container}`}>
    <span className={`${styles.dot} ${styles.dot1}`}/>
    <span className={`${styles.dot} ${styles.dot2}`}/>
    <span className={`${styles.dot} ${styles.dot3}`}/>
    <span className={`${styles.dot} ${styles.dot4}`}/>
  </span>
)