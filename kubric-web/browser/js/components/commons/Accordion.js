import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/accordion';
import { getPreactChildProps as getChildProp } from "@bit/kubric.utils.common.preact";
import { Spinner } from "../index";

export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.current,
    }
  }

  static onAnimationEnd(e) {
    const cl = e.target.classList;
    cl[cl.contains(styles.expand) ? 'add' : 'remove'](styles.overflow);
  }

  cloneChild(child, index) {
    const { current, previous } = this.state;
    const { theme = {} } = this.props;
    const name = getChildProp(child, 'name');
    const isLoading = getChildProp(child, 'isLoading');
    const headElement = getChildProp(child, 'headElement');
    const data = getChildProp(child, 'data');
    const value = getChildProp(child, 'value');
    const showTriangle = getChildProp(child, 'showTriangle', true);
    const isExpanded = current === index || current === value;
    const stateClasses = `${isExpanded ? styles.expand : ''} ${current === previous ? styles.contract : ''}`;
    return (
      <div className={`${styles.section} ${stateClasses} ${theme.section || ''}`}>
        <div className={styles.headingContainer}>
          <div className={`${styles.heading} ${theme.accordionHeader}`}
               onClick={() => this.props.onSelect && this.props.onSelect(index, name, data)}>{headElement || name}</div>
          {showTriangle ? <div className={`${theme.triangle || ''} ${styles.triangle}`}/> : <span/>}
        </div>
        <div onTransitionEnd={::Accordion.onAnimationEnd}
             className={`${styles.content} ${isExpanded && theme.expandedContent ? theme.expandedContent : ''} ${stateClasses} ${theme.content || ''}`}>
          {child}
          {isLoading ? <Spinner theme={styles}/> : <span/>}
        </div>
      </div>
    )
  }

  componentWillReceiveProps({ current }) {
    typeof current !== 'undefined' && current !== this.state.current && this.setState({
      current,
      previous: this.state.current,
    });
  }

  render() {
    const _this = this;
    const { theme = {} } = _this.props;
    return (
      <div className={`${styles.accordion} ${theme.accordion}`}>
        {this.props.children.map((child, index) => _this.cloneChild(child, index))}
      </div>
    )
  }
}
