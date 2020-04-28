import { h, Component } from "preact";
import { isFunction } from "@bit/kubric.utils.common.lodash";

export default class Poller extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		const { interval = 1000, callback } = this.props;
		if (isFunction(callback)) {
			this.timer = setInterval(callback, interval);
		}
	}

	componentWillUnmount() {
		clearInterval(this.timer);
		this.timer = null;
	}

	render() {
		const { children } = this.props;
		return <div>{children}</div>;
	}
}
