import { h } from 'preact';
import styles from 'stylesheets/assets/panel';
import { CustomTypeFilter } from './index';

export default ({ filter, onFilterChange, selected }) => (
  <div className={`${styles.content} ${styles.typeContent}`}>
    {Array.isArray(filter.data) && filter.data.map(flt => {
      return <CustomTypeFilter onClick={onFilterChange.bind(null, {
        ...filter,
        data: {
          value: flt.value,
          label: flt.label
        }
      })} type={flt.value} label={flt.label} isActive={selected.indexOf(flt.value) > -1}/>
    })}
  </div>
);

