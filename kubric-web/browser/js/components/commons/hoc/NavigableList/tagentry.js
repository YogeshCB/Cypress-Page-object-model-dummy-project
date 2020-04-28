import { h, Component } from 'preact';
import { isString, isUndefined } from "@bit/kubric.utils.common.lodash";
import styles from 'stylesheets/components/commons/hoc/navigablelist';

export default class TagEntry extends Component {
  scrollIntoView() {
    const { selected } = this.props;
    if (selected) {
      const itemTop = this.node.offsetTop;
      const itemBottom = this.node.offsetTop + this.node.offsetHeight;
      const parentNode = this.node.parentNode;
      const visibleTop = parentNode.scrollTop;
      const visibleBottom = parentNode.offsetHeight + parentNode.scrollTop;
      if (itemTop < visibleTop || itemBottom > visibleBottom) {
        this.node.scrollIntoView();
      }
    }
  }

  componentDidMount() {
    this.scrollIntoView();
  }

  componentDidUpdate(previousProps, previousState, previousContext) {
    this.scrollIntoView();
  }

  render() {
    const { selected, onMouseUp, onClick, onMouseDown, data } = this.props;
    let label = '', pic = <span/>;
    if (isString(data)) {
      label = data;
    } else {
      label = data.label;
      const { dp } = data;
      if (isString(dp)) {
        pic = <span className={styles.pic} style={{ backgroundImage: `url("${dp}")` }}/>
      } else if (!isUndefined(dp)) {
        const { bg, text } = dp;
        pic = <span style={{ background: bg, color: text }} className={styles.badge}>{label[0].toUpperCase()}</span>
      }
    }
    return (
      <div className={`${styles.menuitem} ${selected ? styles.hovered : ''}`} ref={node => this.node = node}
           onMouseUp={onMouseUp} onClick={onClick} onMouseDown={onMouseDown}>
        {pic}
        <div>{label}</div>
      </div>
    );
  }
};