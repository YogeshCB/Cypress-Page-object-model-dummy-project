import { h } from 'preact';
import styles from 'stylesheets/components/commons/carousel';
import { Spinner } from "../index";

export default ({ children, className = '', isLoading = false, theme = {} }) => (
  <div className={`${styles.carousel} ${theme.carousel || ''} ${className}`}>
    <div className={styles.scrollWrapper}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
    {isLoading ? <Spinner/> : <span/>}
  </div>
);