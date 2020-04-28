import { h, Component } from 'preact';
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import styles from "stylesheets/components/commons/draggable";
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import { getPosition } from "@bit/kubric.utils.common.dom";

const widthSet = new Set(['left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright']);
const heightSet = new Set(['top', 'bottom', 'topleft', 'topright', 'bottomleft', 'bottomright']);
const xSet = new Set(['left', 'topleft', 'bottomleft']);
const ySet = new Set(['top', 'topleft', 'topright']);

export default class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: {
        height: props.height,
        width: props.width
      },
      position: {
        x: props.x,
        y: props.y
      }
    };
  }

  setPosition(e, state = {}) {
    const {
      clientX: x,
      clientY: y,
    } = e;
    if (x > 0 && y > 0) {
      this.setState({
        position: {
          x: x + this.xBuffer,
          y: y + this.yBuffer,
        },
        ...state
      });
    }
  }

  onDrag(e) {
    requestAnimationFrame(this.setPosition.bind(this, e));
  }

  onDragEnd(e) {
    requestAnimationFrame(this.setPosition.bind(this, e, { dragging: false }));
    document.body.removeChild(this.containerClone);
  }

  static setEmptyDragImage(e, dragElmt) {
    const dragImage = dragElmt.cloneNode(true);
    dragImage.style.height = "10px";
    dragImage.style.width = "10px";
    dragImage.style.backgroundColor = "red";
    dragImage.style.opacity = 0;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1200px";
    dragImage.style.left = "-1200px";

    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 100, 100);
    return dragImage;
  }

  onDragStart(e) {
    const { top, left } = getPosition(this.container);
    const { clientX: x, clientY: y } = e;
    this.xBuffer = left - x;
    this.yBuffer = top - y;
    this.setPosition(e, { dragging: true });
    this.containerClone = Draggable.setEmptyDragImage(e, this.container);
  }

  recalculate(prop, e, state = {}) {
    const { clientX, clientY } = e;
    const { containerTop, containerLeft, currentHeight, currentWidth } = this;
    let size = {}, position = {};
    if (clientX > 0 && clientY > 0) {
      if (widthSet.has(prop)) {
        size.width = clientX - containerLeft;
        if (xSet.has(prop)) {
          size.width = currentWidth - size.width;
        }
      }
      if (heightSet.has(prop)) {
        size.height = clientY - containerTop;
        if (ySet.has(prop)) {
          size.height = currentHeight - size.height;
        }
      }
      if (xSet.has(prop)) {
        position.x = clientX;
      }
      if (ySet.has(prop)) {
        position.y = clientY;
      }
      this.setState({
        size: {
          ...this.state.size,
          ...size
        },
        position: {
          ...this.state.position,
          ...position
        },
        ...state
      });
    }
  }

  onResizeStart(prop, e) {
    e.stopPropagation();
    const { top, left } = getPosition(this.container);
    this.containerTop = top;
    this.containerLeft = left;
    this.currentHeight = this.state.size.height;
    this.currentWidth = this.state.size.width;
    this.recalculate(e, { resizing: true });
    this.resizerClone = Draggable.setEmptyDragImage(e, this[`resizer${prop}`]);
    return false;
  }

  onResizeEnd(prop, e) {
    e.stopPropagation();
    requestAnimationFrame(this.recalculate.bind(this, prop, e), { resizing: false });
    document.body.removeChild(this.resizerClone);
  }

  onResize(prop, e) {
    e.stopPropagation();
    requestAnimationFrame(this.recalculate.bind(this, prop, e));
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      if (this.container) {
        const { offsetHeight, offsetWidth } = this.container;
        const { loaded = true } = this.props;
        loaded && this.setState({
          size: {
            height: offsetHeight,
            width: offsetWidth
          }
        });
      }
    });
  }

  componentDidUpdate() {
    const { offsetHeight, offsetWidth } = this.container;
    const { width, height } = this.state.size;
    (offsetWidth !== width || offsetHeight !== height) && this.setState({
      size: {
        height: offsetHeight,
        width: offsetWidth
      }
    });
  }

  render() {
    const { position = { x: 0, y: 0 }, size = {}, dragging, resizing } = this.state;
    const { children, theme = {}, style = {} } = this.props;
    const styler = new StyleExtractor(styles, theme);
    const { x, y } = position;
    const boxStyles = {
      ...style,
      top: y,
      left: x
    };
    const { height, width } = size;
    !isUndefined(height) && (boxStyles.height = height);
    !isUndefined(width) && (boxStyles.width = width);

    const getCorners = () => ['bottomleft', "bottomright", "topright", "topleft"].map(corner => (
      <div draggable={true}
           className={`${styles.resizer} ${styles.corner} ${styles[corner]} ${resizing ? styles.resizing : ''}`}
           onDragStart={this.onResizeStart.bind(this, corner)} onDrag={this.onResize.bind(this, corner)}
           onDragEnd={this.onResizeEnd.bind(this, corner)} ref={node => this[`resizer${corner}`] = node}/>
    ));
    const getEdges = () => ["top", "left", "bottom", "right"].map(edge => (
      <div draggable={true} className={`${styles.resizer} ${styles[edge]} ${resizing ? styles.resizing : ''}`}
           onDragStart={this.onResizeStart.bind(this, edge)} onDrag={this.onResize.bind(this, edge)}
           onDragEnd={this.onResizeEnd.bind(this, edge)} ref={node => this[`resizer${edge}`] = node}/>
    ));
    return (
      <div ref={node => this.container = node} className={styler.get('container')} style={boxStyles}>
        {getEdges()}
        {getCorners()}
        <div className={`${styler.get('draggable')} ${dragging ? styler.get('dragging') : ''}`} draggable={true}
             onDrag={::this.onDrag} onDragEnd={::this.onDragEnd} onDragStart={::this.onDragStart}
             style={{ height: boxStyles.height, width: boxStyles.width }}>
          {children}
        </div>
      </div>
    );
  }
}