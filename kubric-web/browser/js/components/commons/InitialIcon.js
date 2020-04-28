import { h, Component, render } from "preact";
import styles from "stylesheets/initialicon";
import appIcons from "stylesheets/icons/app";
import { isString } from "@bit/kubric.utils.common.lodash";
import { getRandomColor } from "../../lib/colors";

const initial = name => isString(name) && name[0];

export default class InitialIcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bgColor: {
				background: getRandomColor()
			}
		};
	}

	render() {
		const { name, theme = {}, tick, color } = this.props;
		const { bgColor } = this.state;
		return (
			<div className={`${theme.icon || ""} ${styles.icon}`} style={color ? { background: color } : bgColor}>
				{tick ? <span className={`${styles.tick} ${appIcons.iconWhiteTick}`} /> : initial(name)}
			</div>
		);
	}
}
