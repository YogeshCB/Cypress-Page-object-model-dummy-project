import { h, Component } from "preact";
import Scrollable from "./hoc/Scrollable";
import { at, mapValues } from "@bit/kubric.utils.common.lodash";
import styles from "stylesheets/components/commons/mediagrid";
import Image from "./media/Image";
import Video from "./media/Video";
import Audio from "./media/Audio";
import Folder from "./media/folder";
import config from "../../config/index";
import Hoverable from "./hoc/Hoverable";
import Selectable from "./hoc/Selectable";
import Selected from "./media/overlays/Select";
import LoadingAsset from "./media/LoadingAsset";
import Hovered from "./media/overlays/Hover";
import { File } from "./media/File";

const defaultThumbnail = config.assets.thumbnailURL;

const transform = (url) => {
	if(url.indexOf('cloudinary')>-1){
		return url.slice(0,url.indexOf('upload'))+'upload/w_220'+url.slice(url.indexOf('upload')+6);
	}
	else {
		return url
	}
}

export const mediaComponentMap = {
	image: {
		component: Image,
		props: (mediaData, { onClicked, theme = {} }) => ({
			attribution: at(mediaData, "attribution.text")[0],
			image: transform(mediaData.url) || mediaData,
			onClicked,
			file_type: mediaData.file_type,
			height: mediaData.height,
			width: mediaData.width,
			grid: mediaData.grid,
			className: `${styles.image} ${theme.image ? theme.image : ""}`,
			maintainAspectRatio: true,
			theme: {
				...styles,
				container: styles.imageContainer,
				...theme
			}
		})
	},
	video: {
		component: Video,
		props: (mediaData, { shrinkOptions, theme }) => ({
			...mediaData,
			showDuration: true,
			hoverPlay: defaultThumbnail !== mediaData.thumbnail,
			media: mediaData.url || mediaData,
			className: `${styles.video}`,
			hideControls: true,
			shrinkOptions,
			theme: {
				...styles,
				...theme,
				hoverDuration: styles.hoverDuration,
				container: styles.videoContainer
			},
			preload: "metadata",
			playDebounce: 1000
		})
	},
	audio: {
		component: Audio,
		props: (mediaData, { theme = {} }) => ({
			...mediaData,
			theme,
			preload: "metadata",
			playDebounce: 1000,
			hoverPlay: true,
			hideControls: true,
			media: mediaData.url,
			className: theme.audio
		})
	},
	folder: {
		component: Folder,
		props: (mediaData, { size, view = "tiles", userEmail, theme = {}, shrinkOptions } = {}) => ({
			view,
			size,
			shrinkOptions,
			theme,
			folder: mediaData,
			path: mediaData.path,
			name: mediaData.name,
			className: styles.folderContainer,
			shared: mediaData.owner !== userEmail
		})
	},
	font: {
		component: Image,
		props: (mediaData, { theme = {} }) => ({
			attribution: mediaData.attribution && mediaData.attribution.text,
			image: mediaData.thumbnail || mediaData,
			className: `${styles.image} ${theme.image ? theme.image : ""}`,
			theme: { ...styles, ...theme }
		})
	},
	archive: {
		component: File,
		props: (mediaData, { theme }) => ({
			...mediaData,
			className: `${styles.image} ${theme.image ? theme.image : ""}`,
			theme: { ...styles, ...theme }
		})
	},
	blob: {
		component: File,
		props: (mediaData, { theme }) => ({
			...mediaData,
			className: `${styles.image} ${theme.image ? theme.image : ""}`,
			theme: { ...styles, ...theme }
		})
	},
	loading_asset: {
		component: LoadingAsset,
		props: (mediaData, props) => {
		  const { theme = {} } = props;
		  return ({
			data: mediaData,
			theme
		  })
		}
	  }
};

class MediaGrid extends Component {
	constructor(props) {
		super(props);
	}

	_handleKeyDown = event => {
		const { keyHandler } = this.props;
		const { managingFocus } = this.state;
		managingFocus && keyHandler && keyHandler(event);
	};

	_handleDocumentClick = event => {
		const { clearSelection } = this.props;
		if (clearSelection && event && event.target && event.target === this.container) {
			clearSelection();
		}
	};

	componentDidMount() {
		document.addEventListener("click", this._handleDocumentClick);
		document.addEventListener("keydown", this._handleKeyDown);
		// const width = this.container.getBoundingClientRect().width;
		// console.log("width is  " + width);
		// console.log(Math.trunc(width / 225));
	}

	componentWillUnmount() {
		document.removeEventListener("click", this._handleDocumentClick);
		document.removeEventListener("keydown", this._handleKeyDown);
		document.removeEventListener("mousedown", this._handleMouseDown);
	}

	render() {
		let {
			selectable = true,
			media = [],
			selected = [],
			onSelected,
			isSearchEnabled = false,
			onUnselected,
			onMultipleSelected,
			componentMap = {},
			shrinkOptions,
			selectAll,
			unselectAll,
			isPickerOpen,
			selectedIds
		} = this.props;

		const props = this.props;

		let mergedComponentMap = mapValues(mediaComponentMap, (componentConf, type) => {
			const mergedConf = componentConf;
			if (componentMap[type]) {
				Object.assign(mergedConf, componentMap[type]);
			}
			return mergedConf;
		});

		mergedComponentMap = Object.keys(componentMap).reduce((acc, type) => {
			if (!acc[type]) {
				acc[type] = componentMap[type];
			}
			return acc;
		}, mergedComponentMap);

		const d = new Date();

		return (
			<div className={`${styles.mediagrid} ${selectable ? styles.selectable : ""}`}>
				{media.length === 0 || isPickerOpen ? (
					""
				) : (
					<div className={styles.header}>
						<h3 className={styles.title}>{isSearchEnabled ? "Results" : "Assets"}</h3>
						<div className={styles.separator} />
						{isPickerOpen?null:<span className={styles.selectAction} onClick={selected.length > 0 ? unselectAll : selectAll}>
							{selected.length > 0 ? "Unselect All" : `Select All`}{" "}
							{`(${selected.length > 0 && selected.length < media.length ? selected.length : media.length})`}
						</span>}
					</div>
				)}
				<div
					className={styles.grid}
					ref={container => {
						this.container = container;
					}}>
					{media.map((mediaData, index) => {
						const newAsset = d.getTime() - Date.parse(`${mediaData.created_time}Z`) < 3600;
						const { id, url, filename, file_type, type = "image", selectable = true, hoverable = true, actionable = true } = mediaData;

						const commonProps = {
							url,
							id,
							filename,
							card: true,
							data: mediaData,
							file_type,
							shrinkOptions,
							newAsset: newAsset ? <span className={styles.new}>New</span> : ""
						};

						let renderedCard = mediaData;
						const isSelected = selectedIds.includes(id);
						const onClick = e => {
							if (e) {
								e.stopPropagation();
								e.preventDefault();
							}

							if (e && !isSelected) {
								onSelected(mediaData, e);
							}

							if (isSelected) {
								onUnselected(mediaData, e);
							}
							// setImmediate(isSelected ? onUnselected : , e);
						};
						if (typeof mediaData === "string" || url) {
							const componentConf = mergedComponentMap[mediaData.type];
							const { component: MediaComponent, props: propsFn } = at(componentConf, `extensions.${mediaData.file_type}`, componentConf)[0];
							renderedCard = <MediaComponent onClick={e => actionable && onClick(e)} {...commonProps} {...propsFn(mediaData, props)} />;
						}
						if (selectable) {
							renderedCard = (
								<Selectable
									theme={{ container: styles.selectedParent }}
									selected={isSelected}
									onClick={e => actionable && onClick(e)}
									onSelect={(() => {
										this.state.managingFocus && this[`card${id}`].focus();
									}).bind(this)}
									selectedElement={<Selected />}>
									{renderedCard}
								</Selectable>
							);
						}

						if (hoverable) {
							renderedCard = (
								<Hoverable
									theme={{ container: styles.hoveredParent }}
									active={!isSelected && type !== "folder"}
									hoveredElement={<Hovered data={mediaData} onClick={e => actionable && onClick(e)} />}>
									{renderedCard}
								</Hoverable>
							);
						}

						renderedCard = (
							<div
								tabindex={"-1"}
								ref={ip => {
									this[`card${id}`] = ip;
								}}
								onBlur={() => {
									this._timeoutID = setTimeout(() => {
										if (this.state.managingFocus) {
											this.setState({
												managingFocus: false
											});
										}
									}, 0);
								}}
								onFocus={() => {
									clearTimeout(this._timeoutID);
									if (!this.state.managingFocus) {
										this.setState({
											managingFocus: true
										});
									}
								}}
								className={styles.focusableCard}
								style={selectable ? { cursor: "pointer" } : {}}>
								{renderedCard}
							</div>
						);
						return renderedCard;
					})}
				</div>
			</div>
		);
	}
}

export default MediaGrid;

export const InfiniteMediaGrid = props => (
	<Scrollable {...props}>
		<MediaGrid {...props} />
	</Scrollable>
);
