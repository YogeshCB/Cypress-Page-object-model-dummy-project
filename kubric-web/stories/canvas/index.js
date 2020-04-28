import { h } from "preact";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Canvas from "../../browser/js/components/commons/editor/Canvas.js";

const image = {
	height: 1500,
	width: 2250,
	id: "1",
	url: `https://lh3.googleusercontent.com/hX6mkwxciHnrfNcNB9o2ahRCNVp583TdvZBr7OVtTO2Q2u3caeaHS89dwr1AlFE81_fk3Bmk9lllUuwcW2FEZ1Q=s0`
};

const cropper = {
	type: "shape",
	subType: "rectangle",
	attributes: {
		width: 150,
		height: 150,
		opacity: 0,
		scaleX: 1,
		scaleY: 1,
		fill: "black",
		lockScalingFlip: true
	},
	isCropper: true,
	id: "2",
	supported: true
};

const grid = {
	url: `https://res.cloudinary.com/dsvdhggfk/image/upload/v1555172066/swiggy-grid-small.png`
};

storiesOf("Editor Canvas", module)
	.add("Default", () => <Canvas asset={image} grid={grid} />)
	.add("With Cropper", () => <Canvas asset={image} enableCropper={true} grid={grid} />)
	.add("With Grid", () => <Canvas asset={image} showGrid={true} grid={grid} />)
	.add("With Grid & Cropper", () => <Canvas asset={image} showGrid={true} grid={grid} enableCropper={true} />);
