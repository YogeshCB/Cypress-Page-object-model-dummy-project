import { h } from 'preact';
import styles from 'stylesheets/components/emptypage';
import appIcons from 'stylesheets/icons/app';

export default ({ heading, className = '', subheading, theme = {}, actions = [], hideIcon = false }) => (
  <div className={`${styles.emptypage} ${className}`}>  
    {!hideIcon ? <div className={`${theme.icon || appIcons.iconEmptyPage} ${styles.icon}`}/> : <span/>}
    <div className={styles.heading}>{heading}</div>
    <div className={styles.subheading}>{subheading}</div>
    <div className={`${styles.actions} ${theme.actions || ''}`}>
      {actions}
    </div>
  </div>
);