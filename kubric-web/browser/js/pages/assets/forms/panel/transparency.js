import { h } from 'preact';
import styles from 'stylesheets/assets/panel';
import Checkbox from '../../../../components/commons/Checkbox';

export default ({ filter, onFilterChange, selected }) => {

  return <div className={styles.toggle}>
    {Array.isArray(filter.data) && filter.id === 'tr' &&
    <Checkbox theme={{ ...styles, label: styles.labelFilter }} onChange={onFilterChange.bind(null, {
      ...filter,
      data: {
        value: selected.indexOf('yes') < 0 ? 'yes' : 'no',
        label: selected.indexOf('yes') < 0 ? 'Yes' : 'No'
      }
    })} checked={selected.indexOf('yes') > -1} value={selected.indexOf('yes') > -1 ? 'yes' : 'no'}/>
    }
  </div>
}
          