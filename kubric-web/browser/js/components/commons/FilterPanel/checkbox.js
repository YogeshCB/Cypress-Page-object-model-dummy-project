import { h } from 'preact';
import Checkbox from '../Checkbox';
import styles from 'stylesheets/components/commons/filterpanel';

export const SingleSelect = ({ config, value, onChange }) => {
  let { label, data = {} } = config;
  label = data.label || label;
  return (
    <div className={`${styles.checkbox} ${styles.single}`}>
      <div className={styles.label}>{label}</div>
      <Checkbox theme={styles} checked={value} onChange={onChange.bind(null, config)}/>
    </div>
  );
};

export const MultipleSelect = ({ config, value = [], onChange }) => {
  const { label, data = [] } = config;
  const selectedSet = new Set(value.map(({ data = {} }) => data.value));
  return (
    <div className={`${styles.checkbox} ${styles.multiple}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.values}>
        {
          data.map(option => <SingleSelect config={{ ...config, data: option }} value={selectedSet.has(option.value)}
                                           onChange={onChange}/>)
        }
      </div>
    </div>
  );
};
