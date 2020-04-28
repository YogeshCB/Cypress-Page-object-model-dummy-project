import { h, Component } from "preact";
import styles from "stylesheets/components/commons/range";
import { isFunction } from "@bit/kubric.utils.common.lodash";

const TOP_OFFSET = 15;

const round = (number, increment, offset) => Number((Math.ceil((number - offset) / increment) * increment + offset).toFixed(1));

export class Range extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { min, max, step } = this.props;

		this.slider &&
			this.slider.addEventListener("mousemove", event => {
				const sliderWidth = this.slider.offsetWidth - 1;
				const sliderOffsetX = this.slider.getBoundingClientRect().left - document.documentElement.getBoundingClientRect().left;
				const currentMouseXPos = event.clientX + window.pageXOffset - sliderOffsetX;
				const sliderValAtPos = round((currentMouseXPos / sliderWidth) * (max - min) + min, step, 0);
				if (this.slidertitle) {
					const slidertitleClient = this.slidertitle.getBoundingClientRect();
					this.slidertitle.innerHTML = String(sliderValAtPos);
					this.slidertitle.style.top = slidertitleClient.height - TOP_OFFSET + "px";
					this.slidertitle.style.left = currentMouseXPos - slidertitleClient.width / 2 + "px";
					this.slidertitle.style.opacity = 1;
					if (sliderValAtPos > max || sliderValAtPos < min) {
						this.slidertitle.style.opacity = 0;
					}
				}
			});

		this.slider &&
			this.slider.addEventListener("mouseout", event => {
				if (this.slidertitle) {
					this.slidertitle.style.opacity = 0;
				}
			});
	}
	render() {
		const { min, max, step, value, onChange } = this.props;
		return (
			<div className={styles.container}>
				<div className={styles.title} ref={slidertitle => (this.slidertitle = slidertitle)}>
					{value}
				</div>
				<input
					ref={slider => (this.slider = slider)}
					value={value}
					type="range"
					min={min}
					max={max}
					step={step}
					onInput={e => {
						onChange && isFunction(onChange) && onChange(e.target.value);
					}}
				/>
				<span>
					<input
						value={value}
						type="number"
						min={min}
						max={max}
						step={step}
						onInput={e => {
							onChange && isFunction(onChange) && onChange(e.target.value);
						}}
					/>
				</span>
			</div>
		);
	}
}
