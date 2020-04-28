import { h, Component } from "preact";

export class LazyImage extends Component {
	constructor(props) {
		super(props);
	}

	isInViewport(offset = 0) {
		if (!this.lazyImage) return false;
		const top = this.lazyImage.getBoundingClientRect().top;
		return top + offset >= 0 && top - offset <= window.innerHeight;
	}

	updateImage() {
		const { offset = 0, srcPreload = "", src } = this.props;
		if (this.isInViewport(offset) && this.lazyImage.src !== src) {
			this.lazyImage.src = src;
		} else if (this.lazyImage.src !== src) {
			this.lazyImage.src = srcPreload;
		}
	}

	componentDidMount() {
		this.updateImage();
		document.addEventListener("scroll", this.updateImage.bind(this), true);
	}

	componentWillUnmount() {
		document.removeEventListener("scroll", this.updateImage.bind(this), true);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.src !== this.props.src) this.updateImage();
	}

	render() {
		const { srcPreload = "" } = this.props;
		return <img {...this.props} ref={ref => (this.lazyImage = ref)} src={srcPreload} />;
	}
}
