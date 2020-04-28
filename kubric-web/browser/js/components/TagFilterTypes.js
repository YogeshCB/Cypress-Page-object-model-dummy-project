import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/tagfilter';
import baseStyles from '@bit/kubric.components.styles.commons';
import tagStyles from '@bit/kubric.components.commons.tag/styles';
import Spinner from '@bit/kubric.components.commons.spinner';


export const Tag = ({ children, label, value = {}, highlight, onRemove, theme = {}, onClick }) => {
  return (<div onClick={onClick}
               className={`${theme.tag || ''} ${styles.tag} ${highlight ? `${tagStyles.highlight} ${styles.highlight}` : ''} ${onClick ? tagStyles.clickable : ''} ${tagStyles.tag} ${!value.editable ? tagStyles.noClose : ''}`}>
      {children.length > 0 ? children : <span>{label ? `${label}:` : ''}{value.data.label}</span>}
      {value.editable ? <span className={tagStyles.close} onClick={onRemove}>
      <svg className={`${styles.close}`} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(-5,-5)">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </g>
      </svg>
      </span> :
        <span/>}
    </div>
  );
};

export default class TagFilterTypes extends Component {
  constructor(props) {
    super(props);
    const { source = [], isLoading = false } = props;
    this.state = {
      focus: false,
      query: '',
      selected: -1,
      hideSourceList: source.length === 0 || isLoading,
      selectionList: [],
      showSelectedList: false,
      selectedValue: -1,
      highlight: -1,
      isLoading: false
    };
  }

  hasValue() {
    return (!this.props.selected || this.props.selected.length === 0);
  }

  onClick() {
    if (this.state.query.indexOf(':') > 0) {
      this.setState({
        focus: true,
        hideSourceList: false,
        showSelectedList: true,
      })
    } else {
      this.setState({
        focus: true,
        hideSourceList: false,
        showSelectedList: false
      });
    }
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
      hideSourceList: true,
      showSelectedList: false
    });
  }

  checkAndTriggerSelected(value) {
    let maxCount = this.props.maxCount;
    let onSelected = this.props.onSelected;
    if(value.data.value.length > 0) {
      onSelected && (!maxCount || maxCount && this.props.selected.length < maxCount) && onSelected(value);
      this.props.hideOnSelection && this.setState({
        focus: true,
        hideSourceList: false,
        showSelectedList: false,
        query: '',
        highlight: this.props.selected.length - 1,
        selectedValue: -1,
        selected: -1
      });
    }
    this.inputNode.value = '';
  }

  onKeyUp(e) {
    const { source } = this.props;
    if (this.menuEntered) {
      this.menuEntered = false;
    } else if (e.keyCode === 13) {
      e.preventDefault();
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
      }
      this.props.onChange(value, this.state.selectionList, this.state.selected)
    }
    if (e.target.value.indexOf(':') > -1 && e.target.value.split(':')[1].length === 0) {
      this.setState({
        showSelectedList: true,
        hideSourceList: true,
      });
      const index = TagFilterTypes.findFilter(e.target.value.split(':')[0], source);
      if (index > -1) {
        this.onMenuClick(source[index], index, e);
      }
    } else if (e.target.value.indexOf(':') === -1) {
      this.setState({
        showSelectedList: false,
        hideSourceList: false
      })
    }
  }

  static getVisibleSource(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].hide) {
        newArr[i] = {
          ...arr[i]
        }
      }
    }
    return newArr;
  }

  static findFilter(value, arr) {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].label === value) {
        index = i;
        break;
      }
    }
    return index;
  }

  onKeyDown(e) {
    let current = this.state.selected;
    let selectedValue = this.state.selectedValue;
    let nextSelected = current;
    let nextListSelected = selectedValue;
    let { selectionList, showSelectedList } = this.state;
    let { source = [] } = this.props;
    let visibleSource = TagFilterTypes.getVisibleSource(source);
    const value = e.target.value;
    if (e.keyCode === 38) {
      e.preventDefault();
      if (showSelectedList) {
        nextListSelected = this.state.selectedValue === 0 ? selectionList.length - 1 : selectedValue - 1;
        this.setState({
          selectedValue: nextListSelected,
          highlight: -1
        })
      } else {
        nextSelected = this.state.selected === 0 ? visibleSource.length - 1 : current - 1;
        this.setState({
          selected: nextSelected,
        });
      }
    } else if (e.keyCode === 40) {
      e.preventDefault();
      if (showSelectedList) {
        nextListSelected = this.state.selectedValue >= selectionList.length - 1 ? 0 : selectedValue + 1;
        this.setState({
          selectedValue: nextListSelected,
          highlight: -1
        })
      } else {
        nextSelected = this.state.selected >= visibleSource.length - 1 ? 0 : current + 1;
        this.setState({
          selected: nextSelected,
          highlight: -1
        })
      }
    } else if (e.keyCode === 13) {
      this.menuEntered = true;
      this.setState({
        query: '',
        highlight: -1
      });
      if (value && value.split(':')[1] && value.split(':')[1].length > 0 && !showSelectedList) {
        let selected = {};
        if (TagFilterTypes.findFilter(value.split(':')[0], source) !== -1) {
          const index = TagFilterTypes.findFilter(value.split(':')[0], source);
          if (TagFilterTypes.findFilter(value.split(':')[1], source[index].data) !== -1) {
            const filterValueIndex = TagFilterTypes.findFilter(value.split(':')[1], source[index].data);
            selected = Object.assign(source[index], {}, {
              data: {
                value: source[index].data[filterValueIndex].id,
                label: value.split(':')[1].trim()
              }
            });
            this.checkAndTriggerSelected(selected);
          } else {
            selected = Object.assign({}, {
              value: source[index].id,
              id: source[index].id,
              input: 'single',
              editable: true,
              label: source[index].label,
              data: {
                value: value.split(':')[1].trim(),
                label: value.split(':')[1].trim()
              }
            });
            this.checkAndTriggerSelected(selected);
          }
        } else {
          selected = Object.assign(source[this.state.selected], {}, {
            type: source[this.state.selected].value,
            data: {
              value: source[this.state.selected].data[this.state.selectedValue].value,
              label: source[this.state.selected].data[this.state.selectedValue].label
            }
          });
          this.checkAndTriggerSelected(selected);
        }
      } else if (!this.state.hideSourceList && value.indexOf(':') === -1 && visibleSource.length > 0) {
        this.onMenuClick(source[this.state.selected], current, e);
        this.inputNode.value = source[this.state.selected].label;
      } else if (this.state.hideSourceList && value.indexOf(':') > -1) {
        this.onMenuSelectClick(source[this.state.selected].data[this.state.selectedValue], selectedValue, e);
        this.inputNode.value = '';
      } else if (visibleSource.length === 0 && value.indexOf(':') === -1) {
        let selected = Object.assign({}, {
          value: 'query',
          input: 'single',
          id: 'query',
          editable: true,
          data: {
            value: value,
            label: value
          }
        });
        this.checkAndTriggerSelected(selected);
      }
    } else if (e.keyCode === 8) {
      const selected = this.props.selected;
      const highlight = this.state.highlight;
      if (highlight === -1 && this.state.query === '') {
        this.setState({
          highlight: selected.length - 1
        })
      } else if (selected.length > 0 && highlight > -1) {
        this.props.onDeleted(selected[selected.length - 1]);
        this.setState({
          highlight: -1
        })
      }
    } else if (e.keyCode === 27) {
      this.setState({
        showSelectedList: false,
        hideSourceList: true,
        focus: false
      })
    }
  }

  onDelete(value, event) {
    event.stopPropagation();
    this.props.onDeleted && this.props.onDeleted(value);
  }

  getChips() {
    const { theme = {} } = this.props;
    let selected = this.props.selected || [];
    if (!Array.isArray(selected)) {
      selected = [selected];
    }
    return selected.map((entry, index) => {
      if(entry.data.value.indexOf(',')>-1) {
        const entries = entry.data.value.split(',');
        return entries.filter(en=>en !== '').map(ent=> {
          const value = { value: 'query', input: 'single', id: 'query', editable: true, data: {value:ent, label: ent }}
          return <Tag onRemove={this.onDelete.bind(this, entry)} highlight={this.state.highlight === index} value={value}
          label={value.label} theme={theme}/>
        })
      }
      else {
        return <Tag onRemove={this.onDelete.bind(this, entry)} highlight={this.state.highlight === index} value={entry}
          label={entry.label} theme={theme}/>
      }
    });
  }

  componentWillReceiveProps({ isLoading: hideSourceList }) {
    typeof hideSourceList !== 'undefined' && this.props.isLoading !== hideSourceList && this.setState({
      hideSourceList,
    });
  }

  componentDidUpdate() {
    if (this.state.focus) {
      this.inputNode.focus();
    }
  }

  onMenuClick(entry, index, e) {
    e.stopPropagation();
    let { source = [] } = this.props;
    this.setState({
      query: `${entry.label}:`,
      hideSourceList: true,
      selected: index,
    });
    this.inputNode.value = entry.label + ":";
    if (Array.isArray(entry.data) && entry.data.length > 0) {
      this.setState({
        selectionList: entry.data,
        showSelectedList: true,
      })
    } else {
      this.setState({
        showSelectedList: false,
        hideSourceList: true
      })
    }
  }

  onMenuSelectClick(entry, index, e) {
    e.stopPropagation();
    const { selected } = this.state;
    const { source } = this.props;
    let newSource = Object.assign({}, source[selected], {
      data: entry,
      type: source[selected].id
    });
    this.checkAndTriggerSelected(newSource);
    this.setState({
      query: '',
      hideSourceList: true,
      selectedValue: index,
      showSelectedList: false,
      selectionList: [],
    });
  }

  getList() {
    const { selected } = this.state;
    let { source: entries = [] } = this.props;
    entries = TagFilterTypes.getVisibleSource(entries);
    let entryElmts = entries.map(
      (entry, index) => {
        return !entry.hide ? <div ref={node => this.entryList = node}
                                  className={`${styles.menuitem} ${selected === index ? styles.hovered : ''}`}
                                  onClick={this.onMenuClick.bind(this, entry, index)} onMouseDown={::this.onMouseDown}
                                  onMouseUp={::this.onMouseUp}>{entry.label || entry}</div> : null
      });
    return entryElmts.length > 0 && <div className={styles.menu}>{entryElmts}</div>;
  }

  render() {
    const { focus, hideSourceList, query, showSelectedList } = this.state;
    const { source = [], selected = [], label, showSelected = false, theme = {}, icon } = this.props;
    const emptyValue = !this.hasValue();
    let focusClass = focus ? styles.focus : '';
    let labelClass = `${focusClass} ${(query.length > 0 || (showSelected && emptyValue)) ? styles.hasvalue : ''}`;
    const spinnerTheme = {
      container: styles.spinnerContainer,
      spinner: styles.spinner,
    };
    let selectionList = [];
    if (this.state.selected > -1 && Array.isArray(source[this.state.selected].data)) {
      selectionList = source[this.state.selected].data;
    } else {
      selectionList = this.state.selectionList;
    }
    return (
      <div className={`${theme.filterContainer || ''} ${styles.container}`}>
        <div className={`${styles.tags} ${focusClass}`} onClick={::this.onClick}>
          <div className={`${styles.inputWrapper}`}>
            <span className={`${styles.selected} ${baseStyles.clearfix}`}>
              {icon ? <span className={`${icon} ${styles.icon} ${focusClass}`}/> : <span/>}
              {showSelected ? this.getChips() : <span/>}
              {focus ? <input ref={node => this.inputNode = node}
                              className={`${styles.input} ${!showSelected ? styles.selectedHidden : ''}`}
                              onBlur={::this.onBlur}
                              onKeyUp={::this.onKeyUp} onKeyDown={::this.onKeyDown} value={query}/> :
                <span className={styles.inputClass}>{query}</span>}
            </span>
          </div>
          <span className={`${styles.bar} ${focusClass}`}/>
          {(!focus && query.length < 1 && selected.length === 0) ?
            <label
              className={`${labelClass} ${typeof icon !== 'undefined' ? styles.hasIcon : ''} ${theme.label || ''} ${styles.label}`}>{label}</label> : ''}
          {!showSelectedList && focus && !hideSourceList && source.length > 0 && this.getList()}
          {showSelectedList && this.state.selectionList.length > 0 && <div className={styles.menu}>
            {TagFilterTypes.getVisibleSource(selectionList).map(
              (entry, index) => (
                !entry.hide &&
                <div className={`${styles.menuitem} ${this.state.selectedValue === index ? styles.hovered : ''}`}
                     onClick={this.onMenuSelectClick.bind(this, entry, index)} onMouseDown={::this.onMouseDown}
                     onMouseUp={::this.onMouseUp}>{entry.label}</div>
              ))}</div>}
          {this.state.isLoading ? <Spinner theme={spinnerTheme} noOverlay={true}/> : <span/>}
        </div>
      </div>
    );
  }
}