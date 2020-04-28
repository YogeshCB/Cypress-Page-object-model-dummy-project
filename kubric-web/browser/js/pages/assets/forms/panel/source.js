import { h } from 'preact';
import styles from 'stylesheets/assets/panel';
import Checkbox from '../../../../components/commons/Checkbox';

export default ({ selected, onFilterChange, filter }) => {
  return <div className={`${styles.content}`}>
    {Array.isArray(filter.data) && filter.data.map(flt => {
      {
        return <Checkbox theme={styles} onChange={onFilterChange.bind(null, {
          ...filter,
          data: {
            value: flt.value,
            label: flt.label
          }
        })}
      checked={selected.indexOf(flt.value) > -1} value={flt.value} label={flt.label}/>
      }
    })}
  </div>
}