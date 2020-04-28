import { h } from 'preact';
import styles from 'stylesheets/components/tagfilters';
import { Menu, MenuItem } from "./commons/Menu";
import { Tag } from "./index";

export default ({ filters = [], onAddFilter, onRemoveFilter, theme = {} }) => (
  <div className={`${styles.tagfilters} ${theme.filters || ''}`}>
    {filters.map(({ id: field, selected = [], options = [] }) => {
      const availableFilters = options.filter(option => selected.indexOf(option) === -1);
      return (
        <div className={`${styles.filter} ${theme.filter || ''}`}>
          <div className={styles.headingContainer}>
            <div className={styles.heading}>Filter by {field}</div>
            {availableFilters.length > 0 ? (
              <Menu theme={{ container: styles.menuContainer }} slide='up'
                    iconElement={<div className={styles.addFilter}>+</div>}>
                {availableFilters.map(option => <MenuItem
                  onClick={onAddFilter.bind(null, field, option)}>{option}</MenuItem>)}
              </Menu>
            ) : <span/>}
          </div>
          <div className={styles.selected}>
            {selected.map(selection => <Tag label={selection} onRemove={onRemoveFilter.bind(null, field)}/>)}
          </div>
        </div>
      )
    })}
  </div>
);