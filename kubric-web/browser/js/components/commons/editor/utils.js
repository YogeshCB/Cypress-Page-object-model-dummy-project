import { shadedAreaAttributes } from "./constants";

export const getCropper = asset => ({
	type: "shape",
	subType: "rectangle",
	attributes: {
		width: 150,
		height: 150,
		opacity: 0,
		scaleX: 1,
		scaleY: 1,
		fill: "transparent",
		lockScalingFlip: true
	},
	isCropper: true,
	id: asset.id + "_cropper",
	supported: true
});

export const getAsset = asset => ({
	type: "image",
	attributes: {
		angle: 0,
		opacity: 1,
		width: asset.width,
		height: asset.height
	},
	id: asset.id,
	supported: true,
	imageUrl: asset.url && asset.url.indexOf("storage.googleapis.com") >= 1 ? asset.download : asset.url,
	isAsset: true
});

export const getGrid = (asset, grid) => ({
	type: "image",
	attributes: {
		angle: 0,
		opacity: 1,
		width: asset.width,
		height: asset.height
	},
	id: asset.id + "_grid",
	supported: true,
	imageUrl: grid.url,
	isGrid: true
});

export const getShadedAreaRects = (asset, canvas, cropperFabricObject) => [
	{
		type: "shape",
		subType: "rectangle",
		id: "left",
		attributes: {
			...shadedAreaAttributes,
			left: 0,
			top: 0,
			height: canvas.height,
			width: cropperFabricObject.left
		}
	},
	{
		type: "shape",
		subType: "rectangle",
		id: "right",
		attributes: {
			...shadedAreaAttributes,
			left: cropperFabricObject.left + cropperFabricObject.width,
			height: canvas.height,
			width: canvas.width - cropperFabricObject.left - cropperFabricObject.width
		}
	},
	{
		type: "shape",
		subType: "rectangle",
		id: "top",
		attributes: {
			...shadedAreaAttributes,
			left: cropperFabricObject.left,
			height: cropperFabricObject.top,
			width: cropperFabricObject.width
		}
	},
	{
		type: "shape",
		subType: "rectangle",
		id: "bottom",
		attributes: {
			...shadedAreaAttributes,
			left: cropperFabricObject.left,
			top: cropperFabricObject.top + cropperFabricObject.height,
			height: canvas.height - cropperFabricObject.top - cropperFabricObject.height,
			width: cropperFabricObject.width
		}
	}
];
