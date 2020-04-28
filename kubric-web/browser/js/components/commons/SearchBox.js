import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/searchbox';
import baseStyles from '@bit/kubric.components.styles.commons';
import { Tag } from "../index";
import { debounce } from "@bit/kubric.utils.common.lodash";
import { Spinner } from "../index";

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    const { source = [], query = '', isLoading = false } = props;
    this.state = {
      focus: false,
      selected: 0,
      hideList: source.length === 0 || isLoading,
      query,
    };
  }

  hasValue() {
    return (!this.props.value || this.props.value.length === 0);
  }

  onClick() {
    const { source = [], isLoading = false } = this.props;
    this.setState({
      focus: true,
      hideList: source.length < 1 || isLoading,
    });
  }

  onMouseDown() {
    this.menuClicked = true;
  }

  onMouseUp() {
    this.menuClicked = false;
  }

  onBlur(e) {
    !this.menuClicked && this.setState({
      focus: false,
      hideList: true,
    });
  }

  checkAndTriggerSelected(value) {
    let maxCount = this.props.maxCount;
    let onSelected = this.props.onSelected;
    onSelected && (!maxCount || maxCount && this.props.value.length < maxCount) && onSelected(value);
    this.props.hideOnSelection && this.setState({
      focus: false,
      hideList: true,
    });
  }

  onKeyUp(e) {
    if (this.menuEntered) {
      this.menuEntered = false;
    } else if (e.keyCode === 13) {
      const value = e.target.value;
      const { freeEntry = true } = this.props;
      if (freeEntry) {
        value.length > 0 && this.checkAndTriggerSelected(value);
        this.setState({
          query: '',
        });
      }
    } else {
      const value = e.target.value;
      if (this.previousValue !== value) {
        this.previousValue = value;
        this.setState({
          query: value,
        });
        this.debouncedOnChange(value);
      }
    }
  }

  onKeyDown(e) {
    let current = this.state.selected;
    let nextSelected = current;
    let { source = [] } = this.props;
    if (e.keyCode === 38) {
      nextSelected = this.state.selected === 0 ? source.length - 1 : current - 1;
      this.setState({
        selected: nextSelected
      });
    } else if (e.keyCode === 40) {
      nextSelected = this.state.selected >= source.length - 1 ? 0 : current + 1;
      this.setState({
        selected: nextSelected
      });
    } else if (e.keyCode === 13 && !this.state.hideList) {
      this.menuEntered = true;
      this.setState({
        query: ''
      });
      let selected = source[this.state.selected];
      this.checkAndTriggerSelected(selected);
    }
  }

  onDelete(value, event) {
    event.stopPropagation();
    this.props.onDeleted && this.props.onDeleted(value);
  }

  getChips() {
    const { theme = {} } = this.props;
    let selected = this.props.value || [];
    if (!Array.isArray(selected)) {
      selected = [selected];
    }
    return selected.map((entry, index) => (
      <Tag onRemove={::this.onDelete} hideRemove={entry.hideRemove ? entry.hideRemove : false} value={entry}
           label={entry.label || entry} theme={theme}/>
    ));
  }

  componentWillReceiveProps({ isLoading: hideList }) {
    typeof hideList !== 'undefined' && this.props.isLoading !== hideList && this.setState({
      hideList,
    });
  }

  componentDidUpdate() {
    if (this.state.focus) {
      this.inputNode.focus();
    }
  }

  componentWillMount() {
    const { onChange } = this.props;
    this.debouncedOnChange = debounce(value => {
      onChange && onChange(value);
    }, 500);
  }

  onMenuClick(entry, e) {
    e.stopPropagation();
    this.checkAndTriggerSelected(entry);
    this.inputNode.value = "";
  }

  getList() {
    const { selected } = this.state;
    let { source: entries = [] } = this.props;
    let entryElmts = entries.map(
      (entry, index) => (
        <div className={`${styles.menuitem} ${selected === index ? styles.hovered : ''}`}
             onClick={this.onMenuClick.bind(this, entry)} onMouseDown={::this.onMouseDown}
             onMouseUp={::this.onMouseUp}>{entry.label || entry}</div>
      ));
    return <div className={styles.menu}>{entryElmts}</div>;
  }

  render() {
    const { focus, hideList, query = '' } = this.state;
    const { isLoading, source = [], label, showSelected = false, theme = {}, icon } = this.props;
    const emptyValue = !this.hasValue();
    let focusClass = focus ? styles.focus : '';
    let labelClass = `${focusClass} ${(query.length > 0 || (showSelected && emptyValue)) ? styles.hasvalue : ''}`;
    const spinnerTheme = {
      container: styles.spinnerContainer,
      spinner: styles.spinner,
    };
    return (
      <div className={`${theme.container || ''} ${styles.container}`}>
        <div className={`${styles.tags} ${focusClass}`} onClick={::this.onClick}>
          <div className={`${styles.inputWrapper}`}>
            <span className={`${styles.selected} ${baseStyles.clearfix}`}>
              {showSelected ? this.getChips() : <span/>}
              {icon ? <span className={`${icon} ${styles.icon} ${focusClass}`}/> : <span/>}
              {focus ? <input ref={node => this.inputNode = node}
                              className={`${styles.input} ${!showSelected ? styles.selectedHidden : ''}`}
                              onBlur={::this.onBlur}
                              onKeyUp={::this.onKeyUp} onKeyDown={::this.onKeyDown} value={query}/> :
                <span className={styles.query}>{query}</span>}
            </span>
          </div>
          <span className={`${styles.bar} ${focusClass}`}/>
          <label
            className={`${labelClass} ${typeof icon !== 'undefined' ? styles.hasIcon : ''} ${theme.label || ''} ${styles.label}`}>{label}</label>
          {focus && !hideList && source.length > 0 && this.getList()}
          {isLoading ? <Spinner theme={spinnerTheme} noOverlay={true}/> : <span/>}
        </div>
      </div>
    );
  }
}
