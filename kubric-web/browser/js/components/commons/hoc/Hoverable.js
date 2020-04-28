import { h, Component } from 'preact';
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import { debounce, isFunction, isUndefined } from "@bit/kubric.utils.common.lodash";

export default class Hoverable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: props.hovered || false,
      active: isUndefined(props.active) ? true : props.active
    }
  }

  onMouseEnter(e) {
    const { onMouseEnter } = this.props;
    isFunction(onMouseEnter) && setImmediate(onMouseEnter, e);
    if(!this.state.hovered) {
      this.setState({
        hovered: true
      });
    }
  }

  onMouseLeave() {
    const { onMouseLeave } = this.props;
    isFunction(onMouseLeave) && setImmediate(onMouseLeave, e);
    if(this.state.hovered) {
      this.setState({
        hovered: false
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newState = {};
    if (!isUndefined(nextProps.hovered) && nextProps.hovered !== this.state.hovered) {
      newState.hovered = nextProps.hovered;
    }
    if (!isUndefined(nextProps.active) && nextProps.active !== this.state.active) {
      newState.active = nextProps.active;
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  getHandler(handler) {
    const { debounce: delay } = this.props;
    return isUndefined(delay) ? handler : debounce(handler, delay);
  }

  render() {
    const { children, theme = {}, hoveredElement } = this.props;
    const { hovered, active } = this.state;
    const styler = new StyleExtractor({}, theme);
    return (
      <div style={{ position: "relative" }} className={styler.get('container')} onMouseLeave={::this.onMouseLeave}
           onMouseEnter={::this.onMouseEnter}>
        <div className={styler.get('contents')}>
          {children}
        </div>
        {(active && hovered) ? hoveredElement : <span/>}
      </div>
    );
  }
};