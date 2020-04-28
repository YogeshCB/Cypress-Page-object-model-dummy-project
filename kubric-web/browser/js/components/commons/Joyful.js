import { h, Component } from "preact";
import styles from "stylesheets/components/commons/joyful";
import { throttle, isFunction } from "@bit/kubric.utils.common.lodash";

const DEFUALT_THROTTLE = 60;

const findxt = (x0, y0, x1, y1, dt) => {
	const d = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
	const t = dt / d;
	const xt = (1 - t) * x0 + t * x1;
	const yt = (1 - t) * y0 + t * y1;
	return { x: xt, y: yt };
};

const isNegative = x => x < 0;

export default class Joyful extends Component {
	constructor(props) {
		super(props);
		this.state = {
			innerCirle: {
				top: "50%",
				left: "50%"
			}
		};
	}

	componentDidMount() {
		const { onMove, throttleBy } = this.props;

		if (onMove && isFunction(onMove)) {
			this.onMove = throttle(onMove, throttleBy ? throttleBy : DEFUALT_THROTTLE);
		}

		this.innerCirle &&
			this.innerCirle.addEventListener("drag", e => {
				if (this.innerCirle && this.outerCirle && this.container) {
					const innerCirle = this.innerCirle.getBoundingClientRect();
					const outerCirle = this.outerCirle.getBoundingClientRect();
					const container = this.container.getBoundingClientRect();
					const originX = container.x + container.width / 2;
					const originY = container.y + container.width / 2;
					const outerCirleRadius = outerCirle.width / 2;

					let xDisplacement = e.clientX;
					let yDisplacement = e.clientY;

					if (e.shiftKey) {
						yDisplacement = container.y + container.width / 2;
					} else if (e.metaKey || e.ctrlKey) {
						xDisplacement = container.x + container.width / 2;
					}

					const eq = Math.pow(yDisplacement - originY, 2) + Math.pow(xDisplacement - originX, 2);
					const cent = findxt(originX, originY, xDisplacement, yDisplacement, 75);

					eq <= Math.pow(outerCirleRadius, 2) + innerCirle.width / 2
						? this.setState({ innerCirle: { top: yDisplacement - container.y, left: xDisplacement - container.x } })
						: this.setState({ innerCirle: { left: cent.x - container.x, top: cent.y - container.y } });

					const effectiveXDisplacement = xDisplacement - container.x - container.width / 2;
					const effectiveYDisplacement = -(yDisplacement - container.y - container.width / 2);

					let xBoundryDisplacement = effectiveXDisplacement;
					let yBoundryDisplacement = effectiveYDisplacement;

					if (Math.abs(effectiveXDisplacement) >= outerCirleRadius) {
						xBoundryDisplacement = isNegative(effectiveXDisplacement) ? -outerCirleRadius : outerCirleRadius;
					}

					if (Math.abs(effectiveYDisplacement) >= outerCirleRadius) {
						yBoundryDisplacement = isNegative(effectiveYDisplacement) ? -outerCirleRadius : outerCirleRadius;
					}

					this.onMove && isFunction(this.onMove);
					this.onMove({
						x: xBoundryDisplacement,
						y: yBoundryDisplacement,
						value: this.props.value,
						normalized: {
							x: (xBoundryDisplacement / outerCirleRadius).toFixed(1),
							y: (yBoundryDisplacement / outerCirleRadius).toFixed(1)
						}
					});
				}
			});

		this.innerCirle &&
			this.innerCirle.addEventListener(
				"dragstart",
				function(e) {
					var crt = this.cloneNode(true);
					crt.style.opacity = "0";
					document.body.appendChild(crt);
					e.dataTransfer.setDragImage(crt, 0, 0);
				},
				false
			);

		this.innerCirle &&
			this.innerCirle.addEventListener("dragend", e => {
				this.setState({ innerCirle: { top: "50%", left: "50%" } });
			});
	}

	moveContinuously = (x, y, normalized) => {
		this.onMove({
			x: x,
			y: y,
			value: this.props.value,
			normalized: normalized,
			byStep: true
		});
		this.animation = requestAnimationFrame(this.moveContinuously.bind(this, x, y, normalized));
	};

	render() {
		const { innerCirle } = this.state;
		return (
			<div
				className={styles.container}
				ref={ref => {
					this.container = ref;
				}}>
				<div
					className={styles.outerCirle}
					ref={ref => {
						this.outerCirle = ref;
					}}>
					<div
						className={styles.up}
						onMouseDown={() => {
							cancelAnimationFrame(this.animation);
							this.moveContinuously(0, 1, { x: 0, y: 1 });
						}}
						onMouseUp={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseleave={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseout={() => {
							cancelAnimationFrame(this.animation);
						}}
					/>
					<div
						className={styles.down}
						onMouseDown={() => {
							cancelAnimationFrame(this.animation);
							this.moveContinuously(0, -1, { x: 0, y: -1 });
						}}
						onMouseUp={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseleave={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseout={() => {
							cancelAnimationFrame(this.animation);
						}}
					/>
					<div
						className={styles.left}
						onMouseDown={() => {
							cancelAnimationFrame(this.animation);
							this.moveContinuously(-1, 0, { x: -1, y: 0 });
						}}
						onMouseUp={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseleave={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseout={() => {
							cancelAnimationFrame(this.animation);
						}}
					/>
					<div
						className={styles.right}
						onMouseDown={() => {
							cancelAnimationFrame(this.animation);
							this.moveContinuously(1, 0, { x: 1, y: 0 });
						}}
						onMouseUp={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseleave={() => {
							cancelAnimationFrame(this.animation);
						}}
						onmouseout={() => {
							cancelAnimationFrame(this.animation);
						}}
					/>
				</div>
				<div
					draggable
					className={styles.innerCirle}
					style={{ top: innerCirle.top, left: innerCirle.left }}
					ref={ref => {
						this.innerCirle = ref;
					}}>
					<div className={styles.innerGradient} />
				</div>
			</div>
		);
	}
}
