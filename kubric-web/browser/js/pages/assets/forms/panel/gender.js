import { h } from 'preact';
import styles from 'stylesheets/assets/panel';
import { CustomTypeFilter } from './index';
import { capitalize } from '@bit/kubric.utils.common.lodash';

export default ({ filter, onFilterChange, selected }) => {
  return <div className={`${styles.content} ${styles.typeContent}`}>
    {Array.isArray(filter.data) && filter.data.map(flt => <CustomTypeFilter
      type={flt.value}
      label={flt.label}
      isActive={selected.indexOf(flt.value) > -1}
      onClick={onFilterChange.bind(null, {
        ...filter,
        data: {
          value: flt.value,
          label: capitalize(flt.label)
        }
      })}
    />)}
  </div>
}