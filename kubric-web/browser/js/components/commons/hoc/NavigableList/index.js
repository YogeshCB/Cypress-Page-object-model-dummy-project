import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/hoc/navigablelist';
import { debounce, isUndefined, isNull } from "@bit/kubric.utils.common.lodash";
import TagEntry from './tagentry';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      hideList: true,
      query: ""
    };
  }

  onMouseDown() {
    this.menuClicked = true;
  }

  onMouseUp() {
    this.menuClicked = false;
  }

  onBlur() {
    !this.menuClicked && this.setState({
      hideList: true,
    });
  }

  getSourceFor(query) {
    const { source = [] } = this.props;
    return source.filter(({ label }) => query.length === 0 || (label.toLowerCase().indexOf(query.toLowerCase()) > -1));
  }

  getQueryState(query) {
    const source = this.getSourceFor(query);
    const { selected: currentSelected } = this.state;
    return {
      source,
      selected: (currentSelected > source.length - 1) ? 0 : currentSelected,
      hideList: source.length === 0 ? true : this.state.hideList
    };
  }

  onOpenList(query = "") {
    this.setState({
      ...this.getQueryState(query),
      hideList: false,
    });
  }

  onCloseList() {
    this.setState({
      hideList: true
    });
  }

  onQueryChange(query = "") {
    this.setState(this.getQueryState(query));
  }

  checkAndTriggerSelected(value, clicked = false) {
    const { maxCount, hideOnSelection = true } = this.props;
    const onSelected = this.inputElmt.onListSelected;
    onSelected && (!maxCount || maxCount && this.props.value.length < maxCount) && onSelected.call(this.inputElmt, value, clicked);
    hideOnSelection && this.setState({
      hideList: true,
    });
  }

  onKeyUp(e) {
    if (this.menuEntered) {
      this.menuEntered = false;
    } else {
      const value = e.target.value;
      if (this.previousValue !== value) {
        this.previousValue = value;
        this.debouncedOnChange(value);
      }
    }
  }

  onKeyDown(e) {
    const { selected: current, source = [] } = this.state;
    let nextSelected = current;
    if (e.keyCode === 38) {
      nextSelected = current === 0 ? source.length - 1 : current - 1;
      this.setState({
        selected: nextSelected
      });
    } else if (e.keyCode === 40) {
      nextSelected = current >= source.length - 1 ? 0 : current + 1;
      this.setState({
        selected: nextSelected
      });
    } else if (e.keyCode === 13 && !this.state.hideList) {
      this.menuEntered = true;
      let selected = source[current];
      this.checkAndTriggerSelected(selected);
    }
  }

  componentWillReceiveProps({ isLoading: hideList }) {
    !isUndefined(hideList) && this.props.isLoading !== hideList && this.setState({
      hideList,
    });
  }

  componentWillMount() {
    const { onChange } = this.props;
    this.debouncedOnChange = debounce(value => {
      onChange && onChange(value);
    }, 500);
  }

  onMenuClick(entry, e) {
    e.stopPropagation();
    this.checkAndTriggerSelected(entry, true);
  }

  getInputWidth() {
    if (!isUndefined(this.inputNode) && !isNull(this.inputNode)) {
      return this.inputNode.offsetWidth;
    }
  }

  getList() {
    const { selected, listTop, source: entries = [] } = this.state;
    const style = {
      width: `${this.getInputWidth()}px`
    };
    if (!isUndefined(listTop)) {
      style.top = `${listTop}px`;
    }
    let entryElmts = entries.map(
      (entry, index) => (
        <TagEntry selected={selected === index} onMouseUp={::this.onMouseUp} data={entry}
                  onClick={this.onMenuClick.bind(this, entry)} onMouseDown={::this.onMouseDown}/>
      ));
    return <div className={styles.menu} style={style} ref={node => this.listNode = node}>{entryElmts}</div>;
  }

  getListTop() {
    const { listPosition = "bottom" } = this.props;
    if (!isUndefined(this.listNode) && !isUndefined(this.inputNode) && !isNull(this.listNode) && !isNull(this.inputNode)) {
      return listPosition === "top" ? -this.listNode.offsetHeight : this.inputNode.offsetHeight;
    }
    return false;
  }

  componentDidUpdate(previousProps, previousState, previousContext) {
    const listTop = this.getListTop();
    if (listTop !== false && listTop !== previousState.listTop) {
      this.setState({
        listTop
      });
    }
  }

  render() {
    const { hideList, source = [] } = this.state;
    const { theme = {}, InputComponent, listPosition = "bottom", ...restProps } = this.props;
    return (
      <div className={`${theme.container || ''} ${styles.container}`} ref={node => this.inputNode = node}>
        <div className={styles.positioner}>
          <InputComponent {...restProps} listOpen={!hideList} onKeyDown={::this.onKeyDown}
                          onKeyUp={::this.onKeyUp} onBlur={::this.onBlur} onOpenList={::this.onOpenList}
                          onCloseList={::this.onCloseList} ref={node => this.inputElmt = node}
                          onQueryChange={::this.onQueryChange}/>
          {(!hideList && source.length > 0) && this.getList()}
        </div>
      </div>
    );
  }
}
