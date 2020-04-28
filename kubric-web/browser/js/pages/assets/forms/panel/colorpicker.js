import { h } from 'preact';
import styles from 'stylesheets/assets/panel';
import fonticons from 'stylesheets/icons/fonticons';
import Field from '../../../../components/commons/Field';
import { LinkButton } from '../../../../components/commons/misc';

const COLORS = ['#F4D9DF', '#F7E3DE', '#E8E5DA', '#DEE6C3', '#ADD1C3', '#D1EFF0', '#DAEEFA', '#D4D4E4', '#F0E7EF', '#D6C6B6', '#D0D2D9', '#F0C5D6', '#F8C4A1', '#FFF3C8', '#C5DB91', '#76A693', '#A4DCDE', '#86C1E0', '#7C83A8', '#AF8BB7', '#B29E8A', '#9FA1A8', '#D1534F', '#F08264', '#FEE0A1', '#6cb77e', '#377A71', '#519C90', '#4181A1', '#1F274D', '#554475', '#847364', '#62636B', '#913737', '#806648', '#A4B593', '#3F4C3B', '#294743', '#23313D', '#18292D', '#10131F', '#645B75', '#464543', '#1A1A1A'];

const longHandHex = value => {
  if (value.indexOf('#') > -1) {
    value = value.split('#')[1];
    if (value.length === 3) {
      value = `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`;
      return value;
    }
    return value;
  } else {
    return getHexColor(value);
  }
};

const SwatchPicker = ({ onClick, onColorChange, filter }) => <div className={styles.colorPicker}>{COLORS.map(color =>
  (<div style={{ background: color }} onClick={() => {
    onColorChange(color);
    onClick({
      ...filter, data: {
        label: color,
        value: longHandHex(color)
      }
    })
  }} className={styles.color}/>))}
</div>;


const getHexColor = colorStr => {
  var a = document.createElement('div');
  a.style.color = colorStr;
  var colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) {
    return parseInt(a, 10);
  });
  document.body.removeChild(a);
  return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
};

export default ({ selected, onColorChange, onFilterChange, filter, color }) => {
  return <div className={`${styles.content}`}>
    <div>
      <div className={styles.colorFilter}>
        <Field onKeyUp={e => {
          const code = e.keyCode ? e.keyCode : e.which
          if (code === 13 && selected.indexOf(getHexColor(color)) === -1) {
            onFilterChange({
              ...filter,
              data: {
                label: color,
                value: longHandHex(color)
              }
            })
          } else {
            onColorChange(e.target.value)
          }
        }} icon iconClass={fonticons.fonticonSearch} onChange={onColorChange} theme={styles} value={color}/>
        <input className={`${styles.palette}`} type='color' value={getHexColor(color) || '#333333'}
               onChange={(e) => onColorChange(e.target.value)}
               onInput={(e) => onColorChange(e.target.value)}/>
        <LinkButton onClick={onFilterChange.bind(null, {
          ...filter,
          data: {
            label: color,
            value: longHandHex(color)
          }
        })}>Search</LinkButton>
      </div>
      <SwatchPicker onColorChange={onColorChange} onClick={onFilterChange} filter={filter}/>
    </div>
  </div>
}