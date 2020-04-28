import { h, Component } from "preact";
import appIcons from "stylesheets/icons/app";
import styles from "stylesheets/assets/form";
import { copy } from "../../../components/commons/misc";

export default class VisualAction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			copyText: "Copy URL"
		};
	}

	onCopied = () => {
		this.setState({
			copyText: "Copied!"
		});
		setTimeout(() => {
			this.setState({
				copyText: "Copy URL"
			});
		}, 600);
	};

	render() {
		const { asset_type, fullScreenMode, url, enableGrid, top } = this.props;

		const { copyText } = this.state;

		return (
			asset_type !== "folder" && (
				<div className={top ? styles.visualActionsTop : styles.visualActions}>
					<div onClick={fullScreenMode} className={`${styles.tooltip}`}>
						<span className={`${top ? appIcons.iconExitFullScreen : appIcons.iconFullScreen} ${styles.icon}`} />
						<span className={`${styles.tooltiptext}`}> {top ? "Exit Full Screen" : "Full Screen"}</span>
					</div>
					<div
						className={`${styles.tooltip}`}
						onClick={e => copy(e, this.onCopied, url.indexOf("https://lh3") > -1 || url.indexOf("http://lh3") > -1 ? url + "=s0" : url)}>
						<span className={`${appIcons.iconCB} ${styles.icon}`} />
						<span className={`${styles.tooltiptext}`}>{copyText}</span>
					</div>
					{asset_type === "image" && (
						<div className={`${styles.tooltip}`} onClick={enableGrid}>
							<span className={`${appIcons.iconGrid} ${styles.icon}`} />
							<span className={`${styles.tooltiptext}`}>Grid</span>
						</div>
					)}
				</div>
			)
		);
	}
}
