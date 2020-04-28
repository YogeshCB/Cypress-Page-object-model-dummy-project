import { h, Component } from "preact";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import mixinUploader from "../browser/js/mixins/uploader";
import { assetWhiteList } from "../browser/js/lib/constants";
import styles from "stylesheets/assets/index";

const UploadArea = () => <div> Here </div>;

const AssetsUploader = mixinUploader(UploadArea, {
	theme: {
		container: styles.dropContainer,
		dragover: styles.dragover
	},
	whiteListSet: assetWhiteList,
	multipleUpload: true,
	dropOnly: true
});

storiesOf("FileUploader", module).add("Default", () => (
	<AssetsUploader
		onDropped={data => {
			console.log(data);
		}}
	/>
));
