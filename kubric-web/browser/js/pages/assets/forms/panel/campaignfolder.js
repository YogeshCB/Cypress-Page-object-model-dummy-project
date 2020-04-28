import { h } from 'preact';
import styles from 'stylesheets/assets/panel'
import Checkbox from '../../../../components/commons/Checkbox';

export default ({ filter, onFilterChange, selected }) => {    
  return <div className={styles.toggle}>{Array.isArray(filter.data) && filter.id === 'auto_gen' &&
  <Checkbox theme={{ ...styles, label: styles.labelFilter }} onChange={onFilterChange.bind(null, {
    ...filter,
    data: {
      value: selected.indexOf('true') > -1 && filter.id === 'auto_gen' ? 'false' : 'true',
      label: selected.indexOf('true') > -1 && filter.id === 'auto_gen' ? 'No' : 'Yes'
    }
  })} checked={selected.indexOf('true') > -1 && filter.id === 'auto_gen'} value={selected.indexOf('true') < 0 && filter.id === 'auto_gen' ? 'false' : 'true'}/>}
  </div>
}
            