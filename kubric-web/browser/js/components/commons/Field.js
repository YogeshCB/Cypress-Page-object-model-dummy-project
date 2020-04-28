import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/field';
import { debounce } from "@bit/kubric.utils.common.lodash";
import fontIcons from 'stylesheets/icons/fonticons';
import { isValidString, isUndefined } from "@bit/kubric.utils.common.lodash";

export default class Field extends Component {
  componentWillMount() {
    const { debouncedOnChange, debounce: debounceTimeout = 200 } = this.props;
    if (debouncedOnChange) {
      this.debouncedChangeHandler = debounce(debouncedOnChange, debounceTimeout);
    }
    this.focusHandler = ::this.onFocus;
  }

  onChange(e) {
    const { value } = e.target;
    const { name } = this.props;
    this.props.onChange && this.props.onChange(value, name);
    this.props.onKeyUp && this.props.onKeyUp(e);
    this.debouncedChangeHandler && this.debouncedChangeHandler(value, name);
  }

  onFocus() {
    const { name } = this.props;
    this.props.clearError && this.props.clearError(name);
  }

  render() {
    const { label, hint, icon = false, iconClass = fontIcons.fonticonSearch, type = 'text', style = 'material', multiline = false, theme = {}, value, error, disabled, ...props } = this.props;
    const { input: inputClass = '' } = theme;
    const hasErred = !!error;
    const hasValue = !!isValidString(`${value}`);
    const inputProps = {
      type,
      className: `${inputClass} ${styles.input} ${icon ? styles.inputWithIcon : ''} ${hasValue ? styles.hasValue : ''} ${disabled ? (theme.disabled || '') : ''}`,
      value,
      onFocus: this.focusHandler,
      rows: 3,
      disabled,
      ...props,
      onKeyUp: ::this.onChange,
      onChange: undefined,
    };
    const className = style === 'material' ? styles.material : styles.simple;
    return (
      <div
        className={`${theme.field || ''} ${styles.inputField} ${className} ${hasErred ? styles.error : ''} ${disabled ? styles.disabled : ''}`}>
        <div className={styles.posWrapper}>
          {icon ? <div className={`${iconClass} ${theme.icon} ${styles.icon}`}/> : null}
          {(style === 'simple' && !isUndefined(label)) ?
            <div className={`${theme.label} ${styles.label}`}>{label}</div> : <span/>}
          {!multiline ? <input {...inputProps}/> : <textarea {...inputProps}/>}
          {style === 'material' ? <div
              className={`${theme.label} ${styles.hint} ${!isUndefined(label) ? styles.label : ''}`}>{!isUndefined(label) ? label : (hasValue ? '' : hint)}</div> :
            <span/>}
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }
}