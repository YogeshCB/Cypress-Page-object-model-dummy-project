import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/table';
import TableRows, { ScrollableRows } from './lib/Rows';
import Row from './lib/Row';
import CheckBox from '../Checkbox';
import { GridSettings } from './lib/Settings';
import { Spinner } from "../../index";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortby: '',
      headers: props.headers,
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.headers !== nextProps.headers) {
      this.setState({
        headers: nextProps.headers,
      });
    }
  }

  onRowSelectionChange(index, checked, data) {
    const { onSelected } = this.props;
    onSelected && onSelected(checked, data, index);
  }

  onSettingChange = (filteredHeaders) => {
    const { headers } = this.props;
    this.setState({
      headers: headers.filter((obj, id) => filteredHeaders[id].checked)
    })
  };

  getHeaders() {
    const { headers = [], selectable = false, settings = false } = this.props;
    if (selectable) {
      if (settings) {
        return [
          {
            content: (data, index, { selected: isRowSelected, loading: isLoading } = {}) => (
              <div onClick={e => e.stopPropagation()}>
                {!isLoading ?
                  <CheckBox value={data} checked={isRowSelected}
                            onChange={this.onRowSelectionChange.bind(this, index)}/> :
                  <Spinner noOverlay={true} theme={styles}/>
                }
              </div>
            ),
            theme: {
              cell: styles.selectionCell,
            },
          },
          ...this.state.headers,
        ];
      } else {
        return [
          {
            content: (data, index, { selected: isRowSelected, loading: isLoading } = {}) => (
              <div onClick={e => e.stopPropagation()}>
                {!isLoading ?
                  <CheckBox value={data} checked={isRowSelected}
                            onChange={this.onRowSelectionChange.bind(this, index)}/> :
                  <Spinner theme={styles}/>
                }
              </div>
            ),
            theme: {
              cell: styles.selectionCell,
            },
          },
          ...headers,
        ];
      }
    } else if (settings) {
      return this.state.headers;
    } else {
      return headers;
    }
  }

  getStyleClasses(tableStyles = []) {
    return tableStyles.reduce((acc, mode) => {
      acc = `${acc} ${styles[mode]}`;
      return acc;
    }, '');
  }

  getFields() {
    const { headers } = this.props;
    return headers.map((option) => {
      return <option value={option.data}>{option.displayName}</option>
    })
  }


  onChangeSort(e) {
    this.setState({
      sortby: e.target.value,
    })
  }

  dynamicSort(property) {
    let sortOrder = 1;
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  limitChange(e) {
    const { onLimitChange } = this.props;
    onLimitChange(e.target.value)
  }

  checkScroll() {
    if (this.scroller && this.header) {
      const { clientWidth, offsetWidth } = this.scroller;
      this.header.style.paddingRight = `${offsetWidth - clientWidth}px`;
    }
  }

  componentDidMount() {
    this.checkScroll();
  }

  componentDidUpdate(previousProps, previousState, previousContext) {
    this.checkScroll();
  }

  render() {
    let {
      editable = false, theme = {}, header, search, actions = [], settings = false, limit = false, sortable = true,
      scrollable, style = {}, hideHeader = false, selectable, styles: tableStyles = []
    } = this.props;
    const Rows = scrollable ? ScrollableRows : TableRows;
    if (!Array.isArray(tableStyles)) {
      tableStyles = [tableStyles];
    }
    const headers = this.getHeaders();
    return (
      <span className={`${theme.gridContainer || ''} ${styles.gridContainer}`}>
        <div className={styles.tableContainer}>
          <div className={`${theme.actions} ${styles.tableActions}`}>
            {header ? <div className={`${styles.heading}`}>{header}</div> : ''}
            <div className={styles.left}>
            {search ? (
              <span className={`${theme.search} ${styles.search}`}>
                {search}
              </span>
            ) : ''}
              {actions.length > 0 ? actions : <span/>}
            </div>
            <div className={styles.right}>
            {sortable ? (
              <span className={`${styles.sortBy}`}>
                Sort By
                <span className={styles.select}>
                  <select className={styles.select} value={this.state.sortby} onChange={this.onChangeSort}>
                    <option value={''}>None</option>
                    {this.getFields()}
                  </select>
                </span>
              </span>
            ) : ''}
              {limit ? (
                <span className={`${styles.sortBy}`}>
                Show
                <span className={`${styles.select} ${styles.limit}`}>
                  <select className={styles.selectLimit} value={limit} onChange={this.limitChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                  </select>
                </span>
              </span>
              ) : ''}
              {settings ? (
                <span className={`${styles.settingsDiv}`}>
                <GridSettings headers={this.props.headers} onSettingChange={this.onSettingChange}/>
              </span>
              ) : null}
            </div>
          </div>
          <div className={`${theme.table || ''} ${styles.table} ${sortable || search ? styles.tableShadow : ''}`}>
            <table style={style} className={`
                     ${theme.grid || ''}
                     ${styles.grid}
                     ${editable ? '' : styles.noneditable}
                     ${!scrollable ? '' : styles.scrollable}
                     ${!selectable ? '' : styles.selectable}
                     ${this.getStyleClasses(tableStyles)}
                   `}>
              {!hideHeader ?
                <Row theme={theme} headers={headers} isHeader={true} getRef={node => this.header = node}/> : <span/>}
              <Rows getRef={node => this.scroller = node}
                    data={sortable && this.state.sortby !== '' ? this.props.data.sort(this.dynamicSort(this.state.sortby)) : this.props.data}
                    {...this.props} theme={{ ...theme, scroller: styles.scroller }} noOverlay={true} headers={headers}/>
            </table>
          </div>
        </div>
      </span>
    );
  }
};
