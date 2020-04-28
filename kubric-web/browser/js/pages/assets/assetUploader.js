import { h, Component } from "preact";
import baseStyles from "@bit/kubric.components.styles.commons";
import { isFunction, isUndefined } from "@bit/kubric.utils.common.lodash";
import { getFileExtension } from "../../lib/utils";

export default (
	ComponentToMix,
	{
		whiteListSet,
		accept: mixinAccept,
		onlySelection: readImage = false,
		dropzone = false,
		dropOnly = false,
		theme: baseTheme = {},
		multipleUpload: baseMultipleUpload = false
	} = {}
) => {
	return class UploaderMixinClass extends Component {
		constructor(props) {
			super(props);
			this.state = {
				value: this.props.value,
				onDragOver: false
			};
		}

		readFile(selectedFile) {
			if (selectedFile) {
				let reader = new FileReader();
				let _this = this;
				reader.onload = event => {
					_this.setState({
						value: event.target.result
					});
				};
				reader.readAsDataURL(selectedFile);
			}
		}

		componentWillReceiveProps({ value, uploading }) {
			!uploading &&
				value &&
				this.setState({
					value: value
				});
		}

		onChange(event, fireOnSelected = true) {
			let { multipleUpload } = this.props;
			multipleUpload = typeof multipleUpload !== "undefined" ? multipleUpload : baseMultipleUpload;
			const files = Array.isArray(event) ? event : event.target.files;
			let selectedFile = multipleUpload ? files : files[0];
			const { onFileSelected } = this.props;
			if (selectedFile) {
				!multipleUpload && readImage === true && this.readFile(selectedFile);
				fireOnSelected &&
					onFileSelected &&
					onFileSelected({
						files: selectedFile
					});
			}
		}

		selectFileClick(event) {
			if (!dropOnly) {
				this.fileNode.value = null;
				event.stopPropagation();
				!this.props.uploading && this.fileNode.click();
			}
		}

		static getAllFileEntries(dataTransferItemList) {
			let entries = [].map.call(dataTransferItemList, item => item.webkitGetAsEntry());
			return UploaderMixinClass.iterateEntries(entries);
		}

		static iterateEntries(entries, { files: filesList = [], hasDirectories = false } = {}, path = "") {
			const promises = [];
			entries.forEach(entry => {
				if (entry.isFile) {
					promises.push(
						UploaderMixinClass.readEntryAsFile(entry).then(file => {
							file.calculatedPath = path.length === 0 ? "" : `${path}/${file.name}`;
							filesList.push(file);
						})
					);
				} else if (entry.isDirectory) {
					const currentPath = `${path.length > 0 ? `${path}/` : path}${entry.name}`;
					let reader = entry.createReader();
					hasDirectories = true;
					promises.push(
						UploaderMixinClass.readAllDirectoryEntries(reader).then(entries =>
							UploaderMixinClass.iterateEntries(
								entries,
								{
									hasDirectories,
									files: filesList
								},
								currentPath
							)
						)
					);
				}
			});
			return Promise.all(promises).then(() => ({
				hasDirectories,
				files: filesList
			}));
		}

		static readAllDirectoryEntries(directoryReader, entries = []) {
			return UploaderMixinClass.readEntriesPromise(directoryReader).then(readEntries => {
				if (readEntries.length > 0) {
					entries.push(...readEntries);
					return UploaderMixinClass.readAllDirectoryEntries(directoryReader, entries);
				}
				return Promise.resolve(entries);
			});
		}

		static readEntriesPromise(directoryReader) {
			return new Promise((resolve, reject) => directoryReader.readEntries(resolve, reject)).catch(console.error);
		}

		static readEntryAsFile(entry) {
			return new Promise((resolve, reject) => entry.file(resolve, reject)).catch(console.error);
		}

		onDrop = event => {
			event.preventDefault();
			if (this.state.onDragOver) {
				this.setState({
					onDragOver: false
				});
				if (event.target.id === "dropzone") {
					if (dropzone || dropOnly) {
						let dt = event.dataTransfer;
						if (dt.items) {
							UploaderMixinClass.getAllFileEntries(dt.items)
								.then(::this.whiteListFilter)
								.then(::this.processFiles);
						}
					}
				}
			}
		};

		whiteListFilter(results) {
			if (!isUndefined(whiteListSet) && isFunction(whiteListSet.has)) {
				const { files, hasDirectories } = results;
				const filteredFiles = files.filter(file => {
					const extension = getFileExtension(file).toLowerCase();
					return whiteListSet.has(extension);
				});
				return {
					files: filteredFiles,
					hasDirectories
				};
			} else {
				return results;
			}
		}

		processFiles({ files = [], hasDirectories = false } = {}) {
			const { onDropped } = this.props;
			files.length > 0 && this.onChange(files, false);
			onDropped &&
				onDropped({
					files,
					hasDirectories
				});
		}

		onDragOver = event => {
			event.preventDefault();
			if (!this.state.onDragOver) {
				if (dropzone || dropOnly) {
					event.preventDefault();
					const { onDragOver } = this.props;
					this.setState({
						onDragOver: true
					});
					onDragOver && onDragOver();
				}
			}
		};

		onDragLeave = event => {
			if (this.state.onDragOver && (event.pageX <= 0  || event.pageY <= 0 )) {
				if (dropzone || dropOnly) {
					event.preventDefault();
					this.setState({
						onDragOver: false
					});
				}
			}
		};

		componentDidMount() {
			if (this.uploader) {
				document.addEventListener("dragover", this.onDragOver);
				document.addEventListener("dragend", this.onDragLeave);
				document.addEventListener("dragleave", this.onDragLeave);
				document.addEventListener("drop", this.onDrop);
			}
		}

		componentWillUnmount() {
			document.removeEventListener("dragover", this.onDragOver);
			document.removeEventListener("dragend", this.onDragLeave);
			this.uploader.removeEventListener("dragleave", this.onDragLeave);
			document.removeEventListener("drop", this.onDrop);
		}

		render() {
			let { theme = {} } = this.props;
			theme = {
				...baseTheme,
				...theme
			};
			const { onDragOver } = this.state;
			const { accept: propAccept, directory } = this.props;
			return (
				<div ref={node => (this.uploader = node)}>
					<ComponentToMix {...this.props} />
					{directory ? (
						<input
							type="file"
							accept={propAccept || mixinAccept}
							webkitdirectory
							directory
							multiple
							className={baseStyles.hide}
							ref={node => (this.fileNode = node)}
							onChange={::this.onChange}
						/>
					) : (
						<input
							type="file"
							accept={propAccept || mixinAccept}
							multiple
							className={baseStyles.hide}
							ref={node => (this.fileNode = node)}
							onChange={::this.onChange}
						/>
					)}
					{onDragOver && <div id={"dropzone"} className={`${baseStyles.container} ${theme.container || ""} ${theme.dragover}`} />}
				</div>
			);
		}
	};
};
