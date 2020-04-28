import { h, Component } from 'preact';
import Field from '../commons/Field';
import ColorPicker from '../commons/ColorPicker';
import Image from '../commons/media/Image';
import styles from 'stylesheets/components/parameters/fields';
import AlphaPicker from '../commons/AlphaPicker';
import Joyful from '../commons/Joyful';
import fontIcons from 'stylesheets/icons/fonticons';
import { Toggle } from '../commons/Toggle';
import { Range } from '../commons/Range';
import { SecondaryButton } from '../commons/misc';
import appIcons from '../../../stylesheets/icons/app';
import CustomToggle from '../commons/CustomToggle';

const getColor = (color = '') =>
  color.length === 0 ? color : (/^#/.test(color) ? color : `#${color}`);

const getAlphaRangeValueFromColor = (color = '') => {
  if (color.length === 7) {
    return 1;
  } else {
    return (parseInt(color.substring(7, 9), 16) / 255).toFixed(2);
  }
};

const editColorOpacity = (color = "", i) => {
  return `${color.substring(0, 7)}${getAlphaHexFromRangeValue(i)}`;
};

const getAlphaHexFromRangeValue = (value) => {
  const alpha = Math.round(value * 255);
  return (alpha + 0x10000)
    .toString(16)
    .substr(-2)
    .toUpperCase();
};

export const AssetField = type => ({ value, label, onChange, meta, pickAsset }) => {
  return (<span className={styles.assetContainer}>
    <Field label={label} value={value} onChange={onChange}/>
		<SecondaryButton theme={{ button: styles.buttonRelative }} onClick={pickAsset.bind(null, {
      type: type, callback: (asset) => {
        onChange(asset[0].url)
      }, meta
    })}>
		<span className={fontIcons.fonticonSearch}/> &nbsp;Change</SecondaryButton>
  </span>
  );
};

export const ImageField = ({ value, label, onChange, pickAsset, meta }) => {
  return (
    <span className={styles.image}>
		<div className={styles.imagePreview}>
			<Image maintainAspectRatio image={value} theme={{ container: styles.imageContainer, image: styles.imageTag }}/>
			<SecondaryButton theme={styles} onClick={pickAsset.bind(null, {
        type: 'image', callback: (asset) => {
          onChange(asset[0].url)
        }, meta
      })}>
				<span className={fontIcons.fonticonSearch}/> Change</SecondaryButton>
		</div>
		<div className={styles.imageField}>
		<div className={styles.action}>
			<Field theme={styles} label={label} value={value} onChange={onChange}/>			
		</div>
		</div>
  </span>
  );
};

export const ColorField = ({ value, label, onChange, meta }) => {
  const color = getColor(value);
  const showAlpha = meta && !meta.disableAlpha;
  return (
    <span className={styles.colorContainer}>
      <ColorPicker value={color} onChange={onChange} theme={{ container: styles.picker }}/>
      <Field label={label} value={color} onChange={onChange}/>
      {showAlpha && (
        <AlphaPicker
          color={color.substring(0, 7)}
          onChange={event => {
            onChange(editColorOpacity(color, event.target.value));
          }}
          alpha={getAlphaHexFromRangeValue(getAlphaRangeValueFromColor(color))}
        />
      )}
      <br/>
    </span>
  );
};

export const AlphaField = ({ value, label, onChange, meta }) => {
  return (
    <span className={styles.colorContainer}>
			<Field label={label} value={value} onChange={onChange}/>
			<AlphaPicker
        color={meta.color ? meta.color : "#000000"}
        onChange={e => {
          onChange(getAlphaHexFromRangeValue(e.target.value));
        }}
        alpha={value}
      />
			<br/>
		</span>
  );
};

export const RangeField = ({ value, label, onChange, meta }) => {
  return (
    <span className={styles.rangeContainer}>
			<div className={styles.label}>
				{label}
			</div>
			<Range value={value} min={meta.min} max={meta.max} step={meta.step} onChange={onChange}/>
    </span>
  );
};

export const ToggleField = ({ value, label, onChange, meta }) => {
  return (
    <span className={styles.toggleContainer}>
			<div className={styles.label}>
					{label}
			</div>
			<br/>
     	<Toggle onValue={meta.on} offValue={meta.off} value={value} onChange={onChange}/>
			<br/>
    </span>
  );
};

export class SizeField extends Component {
  constructor(props) {
    super(props)
    this.state = { maintainAspectRatio: false }
  }

  render() {
    const { value, label, onChange, meta } = this.props;
    const { maintainAspectRatio } = this.state;
    const hParam = meta && meta.h ? meta.h : "h";
    const wParam = meta && meta.w ? meta.w : "w";
    return (
      <span className={styles.sizeContainer}>
					<span className={styles.label}>
						{label}
					</span>
					<div className={styles.flex}>
						<div className={styles.divider}>
							<div className={styles.numericContainer}>
								<div className={styles.label}>
									Height
								</div>
								<input
                  className={styles.numeric}
                  type={"number"}
                  value={value[hParam]}
                  min={1}
                  onInput={event => {
                    const newValue = Number(event.target.value) <= 0 ? 1 : Number(event.target.value);
                    const multiplier = newValue / Number(value[hParam]) <= 0 ? 1 : newValue / Number(value[hParam]);
                    const multipliedWParam = Math.ceil(multiplier * value[wParam])
                    onChange({ [hParam]: newValue, [wParam]: maintainAspectRatio ? multipliedWParam : value[wParam] });
                  }}
                />
							</div>
							<div className={styles.numericContainer}>
								<div className={styles.label}>
									Width
								</div>
								<div className={styles.flex}>
									<input
                    className={styles.numeric}
                    type={"number"}
                    value={value[wParam]}
                    min={1}
                    onInput={event => {
                      const newValue = Number(event.target.value) <= 0 ? 1 : Number(event.target.value);
                      const multiplier = newValue / Number(value[wParam]) <= 0 ? 1 : newValue / Number(value[wParam]);
                      const multipliedHParam = Math.ceil(multiplier * value[hParam]);
                      onChange({
                        [hParam]: maintainAspectRatio ? multipliedHParam : value[hParam],
                        [wParam]: newValue
                      });
                    }}
                  />
								</div>
							</div>
						</div>
						<CustomToggle
              theme={styles}
              iconClassOn={appIcons.closeLock}
              iconClassOff={appIcons.openLock}
              checked={maintainAspectRatio}
              onChange={checked => {
                this.setState({ maintainAspectRatio: checked });
              }}
            />
					</div>
				</span>
    );
  }
}

export const JoystickField = ({ value, label, onChange, meta = {} }) => {
  const xParam = meta.x ? meta.x : "x";
  const yParam = meta.y ? meta.y : "y";

  return (
    <span className={styles.joystickContainer}>
			<span className={styles.label}>
				{label}
			</span>
			<Joyful
        value={value}
        onMove={data => {
          const { step = 10 } = meta;
          const multiplier = step * (data.byStep ? 1 : 10);
          onChange({
            [xParam]: Number(data.value[xParam]) + data.normalized.x * multiplier,
            [yParam]: Number(data.value[yParam]) - data.normalized.y * multiplier
          });
        }}
      />
			<div className={styles.divider}>
						<div className={styles.numericContainer}>
							<div className={styles.label}>
								X
							</div>
							<input
                className={styles.numeric}
                type={"number"}
                label={xParam}
                value={value[xParam]}
                onInput={(event, name) => {
                  onChange({ [xParam]: event.target.value, [yParam]: value[yParam] });
                }}
              />
						</div>
						<div className={styles.numericContainer}>
							<div className={styles.label}>
								Y
							</div>
							<input
                className={styles.numeric}
                type={"number"}
                label={yParam}
                value={value[yParam]}
                onInput={(event, name) => {
                  onChange({ [xParam]: value[xParam], [yParam]: event.target.value });
                }}
              />
						</div>
					</div>
		</span>
  );
};

export default {
  image: ImageField,
  audio: AssetField('audio'),
  video: AssetField('video'),
  url: AssetField('image'),
  color: ColorField,
  range: RangeField,
  alpha: AlphaField,
  joystick: JoystickField,
  size: SizeField,
  toggle: ToggleField
};