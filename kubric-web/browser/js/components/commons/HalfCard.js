import { h } from 'preact';
import styles from 'stylesheets/components/commons/halfcard';

export default ({ heading, children, onTabClick, visible, theme = {} }) => (
  <div className={`${styles.halfcard} ${visible ? styles.expand : styles.contract} ${theme.halfcard || ''}`}>
    {heading ? (<div className={styles.heading} onClick={onTabClick}>{heading}</div>) : <span/>}
    <div className={`${styles.content}`}>
      {children}
    </div>
  </div>
);
