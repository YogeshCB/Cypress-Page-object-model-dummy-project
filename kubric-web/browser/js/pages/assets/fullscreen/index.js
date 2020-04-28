import { h, Component } from "preact";
import styles from "stylesheets/assets/fullscreen";
import appIcons from "stylesheets/icons/app";
import Video from "../../../components/commons/media/Video";
import Audio from "../../../components/commons/media/Audio";
import Folder from "../../../components/commons/media/folder";
import { File } from "../../../components/commons/media/File";
import theme from "stylesheets/components/commons/mediagrid";
import Editor from "../../../components/commons/editor/index";
import VisualActions from "../forms/VisualActions";
import config from "../../../config";

const gridStyles = config.assets.gridStyles;
const gridURL = config.assets.gridStyles.url;

export default class FullScreen extends Component {
	_handleKeyDown = event => {
		const { fullScreenMode, enableGrid } = this.props;
		switch (event.keyCode) {
			case 27:
				fullScreenMode && fullScreenMode();
				break;
			case 186:
				(event.ctrlKey || event.metaKey) && enableGrid && enableGrid();
			default:
				break;
		}
	};

	componentDidMount() {
		this.fullscreen.focus();
		document.addEventListener("keydown", this._handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown);
	}

	navigate = e => {
		const { asset, navigateFullScreen } = this.props;
		if (asset) {
			if (e.keyCode === 37) {
				navigateFullScreen("prev", asset.id);
			} else if (e.keyCode === 39) {
				navigateFullScreen("next", asset.id);
			}
		}
	};

	render() {
		const { navigateFullScreen, asset, fullScreenMode, grid, enableGrid, onTransformChange, variantDialog } = this.props;
		const { url, asset_type } = asset;
		const isCorruptUrl = url && url.indexOf("storage.googleapis.com") >= 1 && url.indexOf(".png") >= 1;

		return (
			<div onKeyDown={e => this.navigate(e)} tabIndex="0" ref={node => (this.fullscreen = node)} className={styles.fullscreen}>
				<VisualActions top={true} enableGrid={enableGrid} asset_type={asset_type} url={url} fullScreenMode={fullScreenMode} />
				{asset.asset_type === "image" && (
					<Editor
						asset={asset}
						showGrid={grid}
						onModified={onTransformChange.bind(this)}
						onSave={() => {
							fullScreenMode();
							variantDialog();
						}}
						grid={{ url: gridURL }}
					/>
				)}
				{asset.asset_type === "font" && <img className={styles.img} src={asset.thumbnail} />}
				{asset.asset_type === "audio" && <Audio playDebounce={1000} hoverPlay={true}
				theme={{ ...theme, container: theme.videoContainer }} media={asset.url} {...asset} />}
				{asset.asset_type === "video" && asset.file_type !== ".mov" && <Video muted={false} theme={theme} media={asset.url} {...asset} />}
				{asset.asset_type === "video" && asset.file_type === ".mov" && <File {...asset} file_type={asset.file_type} theme={theme} />}
				{asset.asset_type === "folder" && <Folder theme={theme} {...{ ...asset, shared: asset.share_with > 0 }} />}
				{asset.asset_type === "blob" && <File theme={styles} file_type={asset.file_type} {...asset} />}
				{asset && (
					<div onClick={navigateFullScreen.bind(null, "prev", asset.id)} className={`${styles.nav} ${styles.prev}`}>
						<span className={`${styles.icon} ${appIcons.iconChevronPrevious}`} />
					</div>
				)}
				{asset && (
					<div onClick={navigateFullScreen.bind(null, "next", asset.id)} className={`${styles.nav} ${styles.next}`}>
						<span className={`${styles.icon} ${appIcons.iconChevronNext}`} />
					</div>
				)}
			</div>
		);
	}
}
