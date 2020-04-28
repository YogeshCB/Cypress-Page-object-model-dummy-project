import { h } from 'preact';
import styles from 'stylesheets/assets/panel'
import Checkbox from '../../../../components/commons/Checkbox';

export default ({ filter, onFilterChange, selected }) => {
  return <div className={styles.toggle}>{Array.isArray(filter.data) && filter.id === 'is_banner' &&
  <Checkbox theme={{ ...styles, label: styles.labelFilter }} onChange={onFilterChange.bind(null, {
    ...filter,
    data: {
      value: selected.indexOf('false') > -1 && filter.id === 'is_banner' ? 'true' : 'false',
      label: 'Exclude Banners'
    }
  })} checked={selected.indexOf('false') > -1 && filter.id === 'is_banner'} value={selected.indexOf('true') < 0 && filter.id === 'is_banner' ? 'false' : 'true'}/>}
  </div>
}
            