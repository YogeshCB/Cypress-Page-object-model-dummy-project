import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/progressbar';
import baseStyles from '@bit/kubric.components.styles.commons';

export default ({ className = '', visible = false, show = false, progress = 0, theme = {} }) => (
  <div className={`${styles.progressBar} ${theme.container} ${(show || visible) ? '' : baseStyles.hide} ${className}`}>
    <div className={`${styles.progress} ${theme.bar}`} style={{ transform: `scaleX(${progress / 100})` }}/>
  </div>
);
