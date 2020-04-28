import { h } from 'preact';
import fontIcons from 'stylesheets/icons/fonticons';
import styles from 'stylesheets/components/commons/drawer';

export default ({ children, show, heading = '', showClose = true, theme = {}, onHide }) => (
  <div className={`${theme.drawer} ${styles.drawer} ${styles[show ? 'expand' : 'contract'] }`}>
    {(heading.length > 0 || showClose) ? (
      <div className={`${styles.header} ${theme.headerDrawer}`} >
        <div className={`${styles.heading} ${theme.heading}`}>{heading}</div>
        {showClose? <div className={`${styles.closeIcon} ${theme.closeIcon} ${fontIcons.fonticonClose}`} onClick={onHide}/> : ''}
      </div>
    ) : <span/>}
    <div className={`${styles.content} ${theme.drawerContent}`}>
      {children}
    </div>
  </div>
);