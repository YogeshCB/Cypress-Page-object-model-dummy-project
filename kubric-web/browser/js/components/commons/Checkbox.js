import { h } from 'preact';
import styles from 'stylesheets/components/commons/checkbox';

export default ({ onChange, checked = false, partial = false, value, label, id, theme = {} }) => (
  <div className={`${styles.checkbox} ${theme.checkbox || ''} ${checked ? `${styles.checked} ${theme.checked}`   : ''}`}
       onClick={e => onChange && onChange(!checked, value)}>
    <div className={`${styles.new} ${checked? theme.borderChecked:''} ${theme.border || ''} ${partial ? ` ${styles.partial}` : ''}`}>
      <div className={styles.check}/>
    </div>
    <label for={id} className={`${theme.label || ''} ${styles.label || ''}`}>{label}</label>
  </div>
);