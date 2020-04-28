import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/table';
import Row from './Row';
import Scrollable from '../../hoc/Scrollable';

export default class Rows extends Component {
  getSetFromProp(propName) {
    let propValue = this.props[propName] || [];
    if (!Array.isArray(propValue)) {
      propValue = [propValue];
    }
    return new Set(propValue);
  }

  onRowChange(rowIndex, cellIndex, cellId, value) {
    const { onChange } = this.props;
    onChange && setImmediate(onChange, rowIndex, cellIndex, cellId, value);
  }

  onRowOver(index, data) {
    const { onRowOver } = this.props;
    onRowOver && setImmediate(onRowOver, data, index);
  }

  onRowClick(index, data) {
    if (!this.disabledSet.has(index)) {
      const { onRowClick } = this.props;
      onRowClick && setImmediate(onRowClick, data, index);
    }
  }

  getLoadingSet() {
    const { loadingRows = [] } = this.props;
    this.loadingCells = {};
    return new Set(loadingRows.reduce((acc, row) => {
      if (typeof row === 'number') {
        acc.push(row)
      } else if (typeof row.index !== 'undefined') {
        if (row.loading) {
          acc.push(row.index);
        }
        if (typeof row.cells !== 'undefined') {
          this.loadingCells[row.index] = row.cells;
        }
      }
      return acc;
    }, []));
  }

  render() {
    const { data = [], auxData = {}, headers, editable, theme = {} } = this.props;
    const selectedSet = this.getSetFromProp('selected');
    const loadingSet = this.getLoadingSet();
    this.disabledSet = this.getSetFromProp('disabled');
    return (
      <div className={`${theme.rows || ''} ${styles.rows}`}>
        {data.map((data, index) =>
          <Row data={data} headers={headers} editable={editable} theme={theme} isHeader={false} index={index}
               onHover={this.onRowOver.bind(this, index)} selected={selectedSet.has(index)}
               loading={loadingSet.has(index)} onClick={this.onRowClick.bind(this, index)} auxData={auxData}
               onChange={this.onRowChange.bind(this, index)} disabled={this.disabledSet.has(index)}
               loadingCells={this.loadingCells[index]}/>)}
      </div>
    );
  }
};

export const ScrollableRows = props => (
  <Scrollable {...props}>
    <Rows {...props}/>
  </Scrollable>
);