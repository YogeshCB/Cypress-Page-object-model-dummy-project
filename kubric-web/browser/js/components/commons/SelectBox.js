import { h, Component } from 'preact';
import { Menu, MenuItem } from './Menu';
import styles from 'stylesheets/components/commons/selectbox';

export default class SelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  onToggled(visible, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this[visible ? 'show' : 'hide']();
  }

  onSelected(value, label, data) {
    const { name, onChange } = this.props;
    onChange && onChange(value, name, data, label);
    this.hide();
  }

  hide(e) {
    this.removeHideHandler();
    this.setState({
      visible: false,
    });
  }

  show() {
    const { clearError, name } = this.props;
    this.addHideHandler();
    this.setState({
      visible: true,
    });
    clearError && clearError(name);
  }

  addHideHandler() {
    document.querySelector('body').addEventListener('click', this.hideHandler, true);
  }

  removeHideHandler() {
    document.querySelector('body').removeEventListener('click', this.hideHandler, true);
  }

  componentDidMount() {
    this.hideHandler = ::this.hide;
  }

  render() {
    const { visible } = this.state;
    const { options = [], value, label, theme = {}, slide, hint = '', hideOptions = {}, error, disabled, children } = this.props;
    let selectedOption;
    let showOptions = options.reduce((acc, option) => {
      if (!hideOptions[option.value]) {
        acc.push(option);
      }
      if (option.value === value) {
        selectedOption = option;
      }
      return acc;
    }, []);
    return (
      <div
        className={`${disabled ? styles.disabled : ''} ${!label ? styles.noLabel : ''} ${styles.selectbox} ${theme.selectbox || ''} ${visible ? styles.opened : ''}`}>
        <div className={styles.posWrapper}>
          <Menu visible={!disabled && visible} theme={{
            container: `${styles.menuContainer} ${theme.menuContainer}`,
            menu: `${theme.menu} ${styles.menu}`,
          }}
                slide={slide}
                iconElement={<div
                  className={`${typeof error !== 'undefined' ? styles.erred : ''} ${theme.selected} ${styles.selected} ${value ? styles.hasValue : ''}`}>
                  {selectedOption ? selectedOption.label : label}
                </div>}
                onToggled={::this.onToggled}>
            {showOptions.length > 0 ? showOptions.map(option => {
              let { value, label, data } = typeof option === 'string' ? {
                value: option,
                label: option,
                data: option
              } : option;
              return (
                <MenuItem onClick={this.onSelected.bind(this, value, label, data)} theme={styles}
                          className={`${value === this.props.value ? styles.selectedOption : ''}`}>
                  {label}
                </MenuItem>
              );
            }) : children}
          </Menu>
          <div className={`${styles.triangleContainer} ${theme.triangle}`} onClick={this.onToggled.bind(this, !this.state.visible)}>
            <div className={`${theme.triangleContainer} ${styles.triangle}`}/>
          </div>
          {hint ?
            <div
              className={`${theme.hint || ''} ${styles.hint} ${typeof selectedOption !== 'undefined' ? styles.hintSelected : ''}`}>{hint}</div> :
            <span/>}
          {typeof error !== 'undefined' ? <div className={styles.error}>{error}</div> : <span/>}
        </div>
      </div>
    );
  }
}