import { h } from "preact";
import styles from "stylesheets/components/commons/colorpicker";

export default ({ value, onChange, theme = {} }) => (
  <div className={`${theme.container || ''} ${styles.container}`}>
    <input type="color" value={value} className={styles.input}
           onChange={e => onChange && setImmediate(onChange, e.target.value)}/>
    <div className={styles.color} style={{ backgroundColor: value }}/>
  </div>
);