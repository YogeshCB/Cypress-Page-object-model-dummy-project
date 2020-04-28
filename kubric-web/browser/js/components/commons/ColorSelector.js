import { h, Component } from 'preact';
import ColorPalette from './ColorPalette';
import styles from 'stylesheets/components/commons/colorselector';
import mixinPaletteVisibility from '../../mixins/visibility';

class ColorSelector extends Component {
  onColorClick() {
    const { show: showPalette } = this.props;
    showPalette();
  }

  onSelected(color) {
    const { onSelected, hide: hidePalette } = this.props;
    hidePalette();
    onSelected && onSelected(color);
  }

  onHide() {
    const { hide: hidePalette } = this.props;
    hidePalette();
  }

  render() {
    const { selected = '#000000', visible } = this.props;
    return (
      <div className={styles.colorSelector}>
        <div className={styles.selectedColor} ref={node => this.position = node} onClick={::this.onColorClick}
             style={{ background: selected }}/>
        <ColorPalette visible={visible} selected={selected} onSelected={::this.onSelected}
                      className={styles.palette} positionElmt={this.position} onHide={::this.onHide}/>
      </div>
    );
  }
};

export default mixinPaletteVisibility(ColorSelector);
