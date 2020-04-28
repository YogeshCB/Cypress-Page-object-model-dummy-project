import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/table';
import { at } from "@bit/kubric.utils.common.lodash";
import MultiText from '../../MultiText';
import { Spinner } from "../../../index";

export default class Cell extends Component {
  static getValue(value) {
    if (typeof value === 'undefined') {
      return '';
    } else if (typeof value === 'string') {
      return value;
    } else {
      return JSON.stringify(value);
    }
  }

  static onFocus(e) {
    e.target.classList.add(styles.editing);
    e.target.addEventListener('blur', Cell.onBlur);
  }

  static onBlur(e) {
    e.target.classList.remove(styles.editing);
    e.target.removeEventListener('blur', Cell.onBlur);
  }

  onChange(e) {
    const value = e.target.value;
    this.props.onChange && this.props.onChange(value);
  }

  getIcon(theme = {}) {
    let { icon, data, defaultIconClass = '' } = this.props;
    let result = {
      elmt: <span/>,
      hasIcon: false,
    };
    if (typeof icon === 'string') {
      const iconImage = at(data, icon, '')[0];
      if (iconImage !== null && iconImage.length > 0) {
        result = {
          elmt: <div className={`${theme.cellIcon} ${styles.cellIcon}`}
                     style={`background-image:url("${iconImage}")`}/>,
          hasIcon: true,
        };
      } else if (defaultIconClass.length > 0) {
        result = {
          elmt: <div className={`${defaultIconClass}`}/>,
          hasIcon: true,
        };
      }
    } else if (typeof icon === 'function') {
      result = {
        elmt: icon(data),
        hasIcon: true,
      };
    }
    return result;
  }

  static getMultilineField(props, content) {
    return !props.disabled ? <textarea rows="5" {...props}>{content}</textarea> :
      <MultiText className={styles.disabledMultiline}>{content}</MultiText>
  }

  getContent(theme = {}) {
    let { value, editable, content, isHeader, rowIndex, rowSelected, rowLoading, cellLoading = false, multiline = false } = this.props;
    if (isHeader) {
      return value;
    } else if (cellLoading) {
      return <div className={styles.cellSpinner}><Spinner noOverlay={true} theme={styles}/></div>;
    } else {
      if (typeof content === 'function') {
        return content(value, rowIndex, {
          selected: rowSelected,
          loading: rowLoading,
        });
      } else {
        const { hasIcon, elmt: iconElmt } = this.getIcon(theme);
        const content = Cell.getValue(value);
        const props = {
          type: 'text',
          onFocus: ::Cell.onFocus,
          disabled: !editable,
          onChange: ::this.onChange,
          className: `${theme.cellInput} ${styles.cellInput} ${hasIcon ? styles.hasIcon : ''}`
        };
        return (
          <span className={`${styles.cellContent} ${theme.cellContent || ''}`}>
            {iconElmt}
            {multiline ? Cell.getMultilineField(props, content) : <input {...props} value={content}/>}
          </span>
        );
      }
    }
  }

  render() {
    const { isHeader, theme = {}, tooltip = '' } = this.props;
    return (<td title={isHeader ? '' : tooltip}
                className={`${(isHeader && theme.header) ? theme.header : ''} ${theme.cell || ''} ${isHeader ? styles.header : ''} ${styles.cell}`}>{this.getContent(theme)}</td>);

  }
}