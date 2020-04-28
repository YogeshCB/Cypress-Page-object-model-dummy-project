import { h, Component } from "preact";
import styles from "stylesheets/components/commons/compoundrange";
import { isFunction } from "@bit/kubric.utils.common.lodash";

const round = (number, increment, offset = 0) => Number((Math.ceil((number - offset) / increment) * increment + offset).toFixed(1));

export default class CompoundRange extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	onChange() {
		const { onChange } = this.props;
		const { val1, val2 } = this.state;
		onChange && isFunction(onChange) && onChange({ val1, val2 });
	}

	fillTrackUpdate(sliderWidth) {
		this.fillTrack.style.left = `${sliderWidth * this.state.val1}px`;
		this.fillTrack.style.width = `${sliderWidth * this.state.val2 - sliderWidth * this.state.val1}px`;
	}

	componentWillReceiveProps(nextProps) {
		const { val1, val2 } = nextProps;
		this.setState({ val1, val2 });
		if (this.slider) {
			const sliderWidth = this.slider.getBoundingClientRect().width;
			this.fillTrackUpdate(sliderWidth);
			this.startThumb.style.left = `${sliderWidth * val1}px`;
			this.endThumb.style.left = `${sliderWidth * val2}px`;
		}
	}

	componentDidMount() {
		const { val1, val2 } = this.props;
		this.setState({ val1, val2 });
		this.fillTrackUpdate = this.fillTrackUpdate.bind(this);
		this.onChange = this.onChange.bind(this);

		if (this.slider) {
			setTimeout(() => {
				const sliderWidth = this.slider.getBoundingClientRect().width;
				this.fillTrackUpdate(sliderWidth);
				this.startThumb.style.left = `${sliderWidth * val1}px`;
				this.endThumb.style.left = `${sliderWidth * val2}px`;
			}, 500);
		}

		this.startThumb &&
			this.startThumb.addEventListener(
				"dragstart",
				function(e) {
					var crt = this.cloneNode(true);
					crt.style.opacity = "0";
					crt.style.cursor = "pointer";
					document.body.appendChild(crt);
					e.dataTransfer.setDragImage(crt, 0, 0);
				},
				false
			);

		this.endThumb &&
			this.endThumb.addEventListener(
				"dragstart",
				function(e) {
					var crt = this.cloneNode(true);
					crt.style.opacity = "0";
					crt.style.cursor = "pointer";
					document.body.appendChild(crt);
					e.dataTransfer.setDragImage(crt, 0, 0);
				},
				false
			);

		this.startThumb &&
			this.startThumb.addEventListener("drag", event => {
				const { min, max, step } = this.props;
				const sliderOffsetX = this.slider.getBoundingClientRect().left - document.documentElement.getBoundingClientRect().left;
				let currentMouseXPos = event.clientX + window.pageXOffset - sliderOffsetX;
				const sliderWidth = this.slider.getBoundingClientRect().width;

				if (currentMouseXPos >= 0 && currentMouseXPos <= sliderWidth) {
					const sliderValAtPos = round((currentMouseXPos / sliderWidth) * (max - min) + min, step, 0);
					if (sliderValAtPos < this.state.val2 && sliderValAtPos >= min) {
						if (this.state.val1 !== sliderValAtPos) {
							this.setState({ val1: sliderValAtPos });
						}
						this.startThumb.style.left = `${sliderWidth * sliderValAtPos}px`;
						this.fillTrackUpdate(sliderWidth);
					}
				}
			});

		this.endThumb &&
			this.endThumb.addEventListener("drag", event => {
				const { min, max, step } = this.props;
				const sliderOffsetX = this.slider.getBoundingClientRect().left - document.documentElement.getBoundingClientRect().left;
				const currentMouseXPos = event.clientX + window.pageXOffset - sliderOffsetX;
				const sliderWidth = this.slider.getBoundingClientRect().width;

				if (currentMouseXPos >= 0 && currentMouseXPos <= sliderWidth) {
					const sliderValAtPos = round((currentMouseXPos / sliderWidth) * (max - min) + min, step, 0);
					if (sliderValAtPos > this.state.val1 && sliderValAtPos <= max) {
						if (this.state.val2 !== sliderValAtPos) {
							this.setState({ val2: sliderValAtPos });
						}
						this.endThumb.style.left = `${sliderWidth * sliderValAtPos}px`;
						this.fillTrackUpdate(sliderWidth);
					}
				}
			});

		this.endThumb && this.endThumb.addEventListener("dragend", this.onChange);
		this.startThumb && this.startThumb.addEventListener("dragend", this.onChange);

		this.slider &&
			this.slider.addEventListener("click", event => {
				const { min, max, step } = this.props;
				const sliderWidth = this.slider.getBoundingClientRect().width;
				const sliderValAtPos = round((event.offsetX / sliderWidth) * (max - min) + min, step, 0);
				if (sliderValAtPos < this.state.val1) {
					this.setState({ val1: sliderValAtPos });
					this.startThumb.style.left = `${sliderWidth * this.state.val1}px`;
					this.fillTrackUpdate(sliderWidth);
					this.onChange();
				}

				if (sliderValAtPos > this.state.val2) {
					this.setState({ val2: sliderValAtPos });
					this.endThumb.style.left = `${sliderWidth * this.state.val2}px`;
					this.fillTrackUpdate(sliderWidth);
					this.onChange();
				}
			});
	}

	render() {
		return (
			<div className={styles.container}>
				<div
					className={styles.slider}
					id={"container"}
					ref={ref => {
						this.slider = ref;
					}}>
					<div
						className={styles.fillTrack}
						ref={ref => {
							this.fillTrack = ref;
						}}
					/>
				</div>

				<div
					draggable
					onDrag={e => {}}
					className={styles.thumb}
					ref={ref => {
						this.startThumb = ref;
					}}
				/>
				<div
					draggable
					onDrag={e => {}}
					className={styles.thumb}
					ref={ref => {
						this.endThumb = ref;
					}}
				/>
			</div>
		);
	}
}
