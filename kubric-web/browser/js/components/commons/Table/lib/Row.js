import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/table';
import Cell from './Cell';
import { at, isFunction } from "@bit/kubric.utils.common.lodash";

export default class Row extends Component {
  onMouseOver() {
    const { onHover } = this.props;
    onHover && onHover(this.props.data);
  }

  onClick() {
    const { onClick } = this.props;
    onClick && onClick(this.props.data);
  }

  onCellChange(cellIndex, cellId, value) {
    const { onChange } = this.props;
    onChange && onChange(cellIndex, cellId, value);
  }

  getToolTip(tooltip) {
    if (typeof tooltip === 'string' && tooltip.length > 0) {
      return at(this.props.data, tooltip);
    } else {
      return undefined;
    }
  }

  getValue(isHeader, displayName='', data, datapath) {
    const { auxData } = this.props;
    if (isHeader) {
      return displayName.toUpperCase();
    } else if (typeof datapath === "function") {
      return datapath(data);
    } else if (typeof datapath === 'string') {
      return at(data, datapath, '')[0];
    } else if (typeof auxData !== 'undefined' && typeof datapath.key === 'string') {
      let cellData = auxData;
      const { key, from, path = '', transformer } = datapath;
      if (typeof from !== 'undefined') {
        cellData = at(auxData, from, {})[0];
      }
      const dataKey = at(data, key, '')[0];
      const value = dataKey.length > 0 ? at(cellData, `${dataKey}${typeof path === 'undefined' ? '' : `.${path}`}`, '')[0] : '';
      return typeof transformer === 'undefined' ? value : transformer(value);
    } else {
      return data;
    }
  }

  render() {
    let { data: rowData = {}, headers = [], isHeader, theme = {}, editable = false, index, selected, loading, disabled, loadingCells = {}, getRef } = this.props;
    const data = isHeader ? headers : rowData;
    return (
      <tr onMouseOver={::this.onMouseOver} onClick={::this.onClick} ref={node => isFunction(getRef) && getRef(node)}
          className={`${disabled ? (theme.disabled || '') : ''} ${disabled ? styles.disabled : ''} ${selected ? (theme.selected || '') : ''} ${selected ? styles.selected : ''} ${isHeader ? (theme.header || '') : ''} ${theme.row || ''} ${isHeader ? styles.header : ''} ${styles.row}`}>
        {
          headers.map(
            ({ displayName, theme: colTheme = {}, data: datapath = '', content, tooltip, icon, defaultIconClass, editable: cellEditable, multiline, cellId }, cellIndex) => {
              const value = this.getValue(isHeader, displayName, data, datapath);
              return (
                <Cell isHeader={isHeader} editable={typeof cellEditable !== 'undefined' ? cellEditable : editable}
                      content={content} rowIndex={index} icon={icon} data={data} tooltip={this.getToolTip(tooltip)}
                      onChange={this.onCellChange.bind(this, cellIndex, datapath)} theme={{ ...theme, ...colTheme }}
                      defaultIconClass={defaultIconClass} rowSelected={selected} rowLoading={loading} value={value}
                      multiline={multiline} cellLoading={typeof cellId !== 'undefined' && loadingCells[cellId]}/>
              )
            })
        }
      </tr>
    );
  }
};