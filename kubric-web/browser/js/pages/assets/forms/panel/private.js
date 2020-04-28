import { h } from 'preact';
import styles from 'stylesheets/assets/panel'
import Checkbox from '../../../../components/commons/Checkbox';

export default ({ filter, onFilterChange, selected }) => {
  return <div className={styles.toggle}>{Array.isArray(filter.data) && filter.id === 'private' &&
  <Checkbox theme={{ ...styles, label: styles.labelFilter }} onChange={onFilterChange.bind(null, {
    ...filter,
    data: {
      value: selected.indexOf('true') < 0 && filter.id === 'private' ? 'true' : 'false',
      label: selected.indexOf('true') < 0 && filter.id === 'private' ? 'Public' : 'Me'
    }
  })} checked={selected.indexOf('true') < 0 && filter.id === 'private'} value={selected.indexOf('true') < 0 && filter.id === 'private' ? 'false' : 'true'}/>}
  </div>
}
            