import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/navigator';
import DeleteAsset from '../../../pages/assets/DeleteAsset';
import ClickOutside from '../../../mixins/ClickOutside';
import Sort from './sortmenu';
import SearchTags from './searchtags';
import { LinkButton } from '../../commons/misc';
import appIcons from 'stylesheets/icons/app';

export default class Navigator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortMenu: false
    };
  }

  handleClick = (e) => {
    if (this.state.sortMenu && this.nodeSortMenu && this.nodeSortMenu.contains(e.target)) {
      return
    }
    this.setState({
      sortMenu: false
    })
  };

  toggleSortMenu = () => {
    this.setState({
      sortMenu: !this.state.sortMenu
    })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.close);
    document.addEventListener("mousedown", this.handleClick, false);
  }

  close = (e) => {
    if (e.keyCode === 27) {
      this.setState({
        sortMenu: false
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.close);
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  render() {
    const {
      names, onClick, selected, loading, assetCount = 0, folderCount = 0, onFilterDeleted, onFilterSelected,
      showFilters, filters, toggleFilters, enableGrid, grid, isPickerOpen, theme
    } = this.props;
    const { sortMenu } = this.state;

    let path = this.props.path.split('/').filter(paths => paths !== '');
    const query = filters.selected.reduce((acc, filter) => {
      if (filter.id === 'query' && filter.data.value.length > 1) {
        return filter.data.value;
      }
    }, '');
    const isSelected = filters.selected.filter((flt) => flt.id === 'created_time');
    const queryFilters = filters.selected.filter(flt => flt.id === 'query');
    const sortMap = {
      'desc': 'Recent',
      'asc': 'Oldest First'
    };

    const SortMenu = ClickOutside({
      component: Sort,
      props: {
        close: this.toggleSortMenu,
        theme: styles,
        className: styles.menu,
        onFilterDeleted,
        onFilterSelected,
        showFilters,
        selected,
        isSelected,
        toggleSortMenu: this.toggleSortMenu
      }
    });
    const isSortPrivateSelected = filters.selected.filter(flt => flt.id === 'created_time' || (flt.id === 'private' && flt.data.value === 'true'));
    const isQueryOnlyEnabled = queryFilters.length === filters.selected.length - 1;
    const tagPool = filters.selected.map(flt => ({ value: flt.data.value, filter: flt }));
    const isQueryPresent = typeof query === 'string' && query.length > 0;
    const isSearchEnabled = isQueryPresent || (filters.selected.length !== isSortPrivateSelected.length)
      || filters.selected.length > 3;

    return (<div className={`${styles.path} ${theme.path}`}>
      {isSearchEnabled || isPickerOpen ?
        <span className={styles.poolText}>
          <span
            className={styles.searchHeadline}>Showing {!loading ? `${assetCount}` : ''} Matches {isQueryOnlyEnabled ? '' : 'for'}</span>
          <SearchTags onFilterDeleted={onFilterDeleted} tags={tagPool}/>
        </span> : isPickerOpen?'':path.map((paths, index) => {
          const showPath = path.length - 1 === index;

          return <span className={styles.span} onClick={showPath ? {} : onClick.bind(null, paths)}>
                     <span className={styles.pathName}>{names[index]}&nbsp;</span>
            {showPath && !loading ? ` (${assetCount + folderCount} items)` : ''}
            {showPath ? ' ' : <div className={styles.separator}></div>}
        </span>
        })}
      {isPickerOpen? '': <div className={styles.actionContainer}>
      {<LinkButton theme={styles} className={`${grid?styles.filterToggleActive:{}} ${styles.filterToggle}`} onClick={enableGrid}>
        <span className={`${appIcons.iconGridTheme} ${styles.actionIconsGrid}`}/>
          Grid
      </LinkButton>}
      {selected.length === 0 && <LinkButton theme={styles} className={`${showFilters?styles.filterToggleActive:{}} ${styles.filterToggle}`} onClick={toggleFilters}>
          <span className={`${appIcons.iconFilter} ${styles.actionIcons}`}/>
          Filter
        </LinkButton>}
        <span onClick={this.toggleSortMenu.bind(this)} className={`${styles.select} ${styles.sortBy} ${styles.share}`}>
            <span
              className={styles.selectedSort}>{isSelected[isSelected.length - 1] ? sortMap[isSelected[isSelected.length - 1].data.value] : 'Relevance'}
            <span className={styles.triangle}/></span>
        </span>
      </div>}

      {sortMenu && !isPickerOpen ? <div ref={node => this.nodeSortMenu = node}>
        <SortMenu/>
      </div> : ''}
      <DeleteAsset/>

    </div>)
  }

};


