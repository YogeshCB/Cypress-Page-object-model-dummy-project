import { h } from 'preact';
import styles from 'stylesheets/components/commons/navigator';
import folderStyles from 'stylesheets/components/commons/media/action';

export default ({ toggleSortMenu, onFilterDeleted, onFilterSelected, isSelected } = props) => {
  return <div className={`${folderStyles.container} ${styles.menu}`}>
    <div onClick={() => {
      onFilterDeleted({
        label: 'Sort By',
        id: 'created_time',
        input: 'single',
        editable: true,
        data: {
          value: 'desc',
          label: 'Descending'
        }
      });
      onFilterDeleted({
        label: 'Sort By',
        id: 'created_time',
        input: 'single',
        editable: true,
        data: {
          value: 'asc',
          label: 'Ascending'
        }
      });
      toggleSortMenu();
    }} className={`${isSelected.length === 0 ? styles.selectSort : ''} ${styles.menuItem} ${styles.sortByValue}`}>
      &nbsp;Relevance
    </div>
    <div onClick={() => {
      onFilterDeleted({
        label: 'Sort By',
        id: 'created_time',
        input: 'single',
        editable: true,
        data: {
          value: 'asc',
          label: 'Ascending'
        }
      });
      onFilterSelected({
        label: 'Sort By',
        id: 'created_time',
        input: 'single',
        editable: true,
        data: {
          value: 'desc',
          label: 'Descending'
        }
      });
      toggleSortMenu();
    }}
         className={`${isSelected.length > 0 && isSelected[isSelected.length - 1].data.value === "desc" ? styles.selectSort : ''} ${styles.menuItem} ${styles.sortByValue}`}>
      &nbsp;Recent
    </div>
  </div>
}