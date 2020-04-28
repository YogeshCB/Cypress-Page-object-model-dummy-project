import { h, Component } from "preact";
import styles from "stylesheets/components/commons/alphapicker";

const getAlphaRangeValue = (alpha = "FF") => {
	return (parseInt(alpha, 16) / 255).toFixed(2);
};

export default class AlphaPicker extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { alpha } = this.props;
		this.input.value = getAlphaRangeValue(alpha);
	}

	render() {
		const { color, alpha = "FF", onChange, theme = {} } = this.props;
		return (
			<div className={`${theme.container || ""} ${styles.container}`}>
				<div className={`${theme.checkboxBackground || ""} ${styles.checkboxBackground}`} />
				<div className={`${theme.gradient || ""} ${styles.gradient}`} style={{ background: `linear-gradient(to right, ${color}00, ${color}FF)` }} />
				<input
					ref={input => {
						this.input = input;
					}}
					value={getAlphaRangeValue(alpha)}
					type="range"
					min={0}
					max={1}
					step={0.01}
					onInput={onChange}
					className={`${theme.overlaySlider || ""} ${styles.overlaySlider}`}
				/>
			</div>
		);
	}
}
