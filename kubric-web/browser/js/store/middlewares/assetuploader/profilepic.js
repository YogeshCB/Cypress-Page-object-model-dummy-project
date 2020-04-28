import services from "../../../services";
import assetUploadPack from "../../objects/assets/fileuploads";
import assetListPack from "../../objects/lists/assets";
import { getFileExtension, getFileKey } from "../../../lib/utils";
import assetTypes from "../../objects/assets/types";
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import { assetWhiteList } from "../../../lib/constants";
import assetSelectors from "../../objects/assets/selectors/index";
import assetActions from "../../objects/assets/actions";
import profileActions from "../../objects/profile/actions";

const errHandler = (dispatch, actions, data, key, err) => {
	dispatch(
		actions.failed({
			data,
			key,
			err
		})
	);
};

const assetUploadFlow = (dispatch, file, data, actions, urlResp = []) => {
	const asset = urlResp[0];
	const { url, blobname, filename } = asset;
	const { key } = data;

	// const assetId = assetListPack.selectors.getSelectedIds()[0];
	return services.assets
		.upload()
		.overrideUrl(url)
		.on("progress", e => {
			dispatch(
				profileActions.profileDataChanged({
					profile_pic: {
						progressPercent: e.percent
					}
				})
			);
			dispatch(
				actions.progressed({
					key,
					data,
					title: filename,
					progressPercent: e.percent,
					fraction:
						parseInt(e.total / 1024) > 0
							? e.total > 1000000
								? `${parseInt(e.loaded / 1024 / 1024)} / ${parseInt(e.total / 1024 / 1024)} MB`
								: `${parseInt(e.loaded / 1024)} / ${parseInt(e.total / 1024)} KB`
							: ""
				})
			);
		})
		.send(file)
		.then(confirmAssetUpload.bind(null, dispatch, asset, actions, data, file))
		.catch(errHandler.bind(null, dispatch, actions, data, key));
};

const confirmAssetUpload = (dispatch, asset, actions, data, file) =>
	services.assets
		.confirmUpload()
		.send(asset)
		.then(checkUploadProcessed.bind(null, dispatch, actions, data))
		.catch(errHandler.bind(null, dispatch, actions, data, asset.id, file));

const checkUploadProcessed = (dispatch, actions, data, asset) => {
	let assetCheckCount = 1;
	const { key } = data;

	return services.assets
		.getAsset()
		.send(asset)
		.then(response => {
			if (typeof response.url !== "undefined" || typeof response.download !== "undefined") {
				dispatch(
					actions.completed({
						data,
						key,
						response
					})
				);
				dispatch(
					profileActions.profileDataChanged({
						profile_image_url: response.download
					})
				);

				return response;
			} else {
				if (assetCheckCount <= MAX_ASSET_CHECK) {
					setTimeout(checkUploadProcessed.bind(null, dispatch, actions, data, asset), 2000);
					assetCheckCount++;
				} else {
					throw new Error(`Unable to confirm uploaded asset ${asset.filename}`);
				}
			}
		});
};

export default store => next => action => {
	let { type } = action;
	let { file, title } = action.payload || {};
	const { actions } = assetUploadPack;
	if (assetTypes.PROFILE_PIC_UPLOAD === type && !isUndefined(file)) {
		const extension = getFileExtension(file);
		//Avoiding hidden files(filenames starting with .) and non-whitelisted files
		if (!/^\./.test(file.name) && assetWhiteList.has(extension)) {
			const data = {
				key: getFileKey(file),
				title: title || file.name,
				name: file.name,
				filetype: file.type
			};

			store.dispatch(
				profileActions.profileDataChanged({
					profile_pic: {
						progressPercent: 0,
						profile_image_url: undefined
					}
				})
			);

			return services.assets
				.getUploadUrls()
				.send({
					files: [file.name],
					is_hidden: true
				})
				.then(assetUploadFlow.bind(null, store.dispatch, file, data, actions))
				.catch(errHandler.bind(null, store.dispatch, actions, data));
		}
	} else {
		return next(action);
	}
};
