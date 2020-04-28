import { h } from 'preact';
import Radio from "../Radio";
import styles from 'stylesheets/components/commons/filterpanel';
import { isString, at } from "@bit/kubric.utils.common.lodash";

export default ({ config, value, onChange }) => {
  let { label, data = [], ...restConfig } = config;
  const onChangeHandler = value => {
    const [selected] = data.filter(({ value: optionValue }) => value === optionValue);
    onChange({
      label,
      ...restConfig,
      displayValue: selected.label
    }, value);
  };
  const finalValue = isString(value) ? value : at((value || {}), 'data.value', '')[0];
  return (
    <div className={`${styles.radio} ${styles.single}`}>
      <div className={styles.label}>{label}</div>
      <Radio options={data} theme={styles} value={finalValue} onChange={onChangeHandler}/>
    </div>
  );
};
