import { h } from 'preact';
import styles from 'stylesheets/components/commons/colorpalette';
import { SelectableGrid } from "./hoc";
import Modal from './Modal';
import { getPosition } from "@bit/kubric.utils.common.dom";

const colors = [
  "#b71c1c", "#d32f2f", "#f44336", "#e57373", "#ffcdd2",
  "#4a148c", "#7b1fa2", "#9c27b0", "#ba68c8", "#e1bee7",
  "#1a237e", "#303f9f", "#3f51b5", "#7986cb", "#c5cae9",
  "#01579b", "#0288d1", "#03a9f4", "#4fc3f7", "#b3e5fc",
  "#004d40", "#00796b", "#009688", "#4db6ac", "#b2dfdb",
  "#33691e", "#689f38", "#8bc34a", "#aed581", "#dcedc8",
  "#f57f17", "#fbc02d", "#ffeb3b", "#fff176", "#fff9c4",
  "#e65100", "#f57c00", "#ff9800", "#ffb74d", "#ffe0b2",
  "#3e2723", "#5d4037", "#795548", "#a1887f", "#d7ccc8",
  "#000000", "#525252", "#969696", "#D9D9D9", "#FFFFFF",
];
const LEFT_BUFFER = 210;
const TOP_BUFFER = 380;

export default ({ onSelected, onUnselected, selected = [], className = '', multiple, visible, positionElmt, onHide }) => {
  selected = typeof selected === 'string' ? [selected] : selected;
  selected = selected.map(selection => colors.indexOf(selection));
  let modalStyles = {};
  if (positionElmt) {
    const position = getPosition(positionElmt, {
      top: TOP_BUFFER,
      left: LEFT_BUFFER,
    });
    modalStyles = {
      top: `${position.bottom}px`,
      left: `${position.right}px`,
    };
  }
  return (
    <Modal visible={visible} layer='transparent' style={modalStyles} onHide={onHide}>
      <div className={`${styles.colorpalette} ${className}`}>
        <SelectableGrid selected={selected} onSelected={onSelected} onUnselected={onUnselected} theme={styles}
                        selectedElement={(
                          <div className={styles.selectedOverlay}>
                            <div className={styles.tick}/>
                          </div>
                        )} multiple={multiple}>
          {colors.map(color => <div data={color} style={{ backgroundColor: color }}
                                    className={`${styles.color} ${color.toLowerCase() === '#ffffff' ? styles.border : ''}`}
          />)}
        </SelectableGrid>
      </div>
    </Modal>
  );
}
