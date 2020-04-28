import { h, Component } from 'preact';
import ColorPalette from './ColorPalette';
import mixinVisibility from '../../mixins/visibility';
import styles from 'stylesheets/components/commons/multicolorselector';
import selectorStyles from 'stylesheets/components/commons/colorselector';

class MultiColorSelector extends Component {
  onColorClick() {
    const { show: showPalette } = this.props;
    showPalette && showPalette();
  }

  onSelected(color) {
    const { onSelected } = this.props;
    onSelected && onSelected(color);
  }

  onUnselected(color) {
    const { onUnselected } = this.props;
    onUnselected && onUnselected(color);
  }

  render() {
    const { selected = [], visible = false, hide: hidePalette } = this.props;
    return (
      <div className={styles.colorSelector}>
        <div className={styles.selections}>
          {selected.map((color, index) => (
            <div className={`${selectorStyles.selectedColor} ${styles.selectedColor}`}
                 onClick={this.onUnselected.bind(this, color, index)}
                 style={{ background: color }} key={`color-selected-${color}`}>
              <div className={styles.selectedColorOverlay}>
                <div className={styles.iconClose}/>
              </div>
            </div>
          ))}
          <div className={`${styles.addColor}`} onClick={::this.onColorClick} ref={node => this.addColorNode = node}
               key={`add-color`}>
            <span>+</span>
          </div>
        </div>
        <ColorPalette selected={selected} multiple={true} onSelected={::this.onSelected} visible={visible}
                      onUnselected={::this.onUnselected} onHide={hidePalette} className={selectorStyles.palette}
                      positionElmt={this.addColorNode}/>
      </div>
    );
  }
}

export default mixinVisibility(MultiColorSelector);
