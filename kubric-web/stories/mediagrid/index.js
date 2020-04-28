import { h, Component } from "preact";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import MediaGrid, { InfiniteMediaGrid } from "../../browser/js/components/commons/MediaGrid";
import Image from "../../browser/js/components/commons/media/Image";
import styles from "./styles.scss";

const images = [
	"https://www.w3schools.com/css/trolltunga.jpg",
	"https://static.pexels.com/photos/34950/pexels-photo.jpg",
	"https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg",
	"https://static.pexels.com/photos/302404/pexels-photo-302404.jpeg",
	"http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg",
	"https://wallpaperscraft.com/image/parrot_love_branch_78610_1400x1050.jpg",
	"https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg",
	"http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg",
	"http://www.wallcoo.net/animal/Cute_Little_Birds_HD_Wallpapers_01/wallpapers/1024x768/Gorgeous_birds_Plain%20Prinia.jpg"
];

const videos = [
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/63f80545-781c-4c96-8a6a-28cd15c4e1e2.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/cb1bbb19-7b5f-4a52-b0db-eed786ac5a61.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/c3d790b5-12a8-49c6-aecd-0e6583ed1850.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/9b99e356-1b6b-4db9-8493-c788c5b36678.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/c77421c7-6c80-4c3f-bf14-77b86ce6e336.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/4995b156-95e5-4df3-883c-b3854a2eac91.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/013261d7-43b2-4e62-b302-3f8478f32f5f.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/c9743595-3b08-4013-8057-ed111261da55.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/305d30ff-0de7-4b5f-986a-1dfe18650e29.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/6d4f62f4-afaf-4597-b879-023e0c4715e3.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/08388a43-276e-44e5-8f68-5b6c3070b627.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/30dce28f-f1f3-4490-b053-befc3a4b8f79.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/6fc52fbc-1163-4213-afaa-3da60552551c.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/81ca0cd8-5df5-4292-94b7-18473b5158b4.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/c52e3379-2cdb-42bf-b9ed-fd77925f706c.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/5de70957-63d7-4b17-bf87-51d3280d6355.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/6bd13d5e-805e-440a-a127-b4eddffec58c.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/384922b9-10f0-43da-9f53-99e9ec62bd3a.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/4485c99f-9f47-42e9-86c5-5c03908f0c8f.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	},
	{
		type: "video",
		url: "https://storage.googleapis.com/asset-library.appspot.com/792fc70a-3858-47ec-9afc-416f82db7b66.mp4",
		thumbnail: "https://static.pexels.com/photos/34950/pexels-photo.jpg"
	}
];

const customImages = [
	<Image theme={styles} data={{ test: "1" }} image={"http://eurodroid.com/pics/sony_ericsson_x10_photo_camera-samples_2.jpg"} text="#text" />,
	<Image theme={styles} data={{ test: "3" }} image={"https://i-cdn.phonearena.com/images/articles/278914-gallery/DSC-0022.JPG.jpg"} />,
	<Image theme={styles} data={{ test: "4" }} image={"https://c1.staticflickr.com/5/4273/34645550480_c068961722_z.jpg"} />,
	<Image
		theme={styles}
		data={{ test: "5" }}
		image={"http://cnet4.cbsistatic.com/hub/i/2014/04/14/cfb54af3-fb29-4347-ab79-d726d3b89cff/purple-flowers-sony-xperia-z2-test.jpg"}
		text="#favorite"
	/>,
	<Image theme={styles} data={{ test: "6" }} image={"https://i-cdn.phonearena.com/images/articles/218136-gallery/Microsoft-Lumia-950-samples.jpg"} />
];

const folders = [
	{
		description: "folder will store more and more confidential information",
		created_time: "2018-08-16T09:57:22.834000",
		url: "None",
		id: "3990f2f0-0f45-4bc8-9e3c-f933f871282a",
		user_id: "vinita@kubric.io",
		type: "folder",
		path: "/root1/71698bc1-cfc7-438c-93d1-04b0663571f3/fc7748f7-feee-4829-a2d0-e4e909a43597",
		name: "myfolder2",
		owner: "vinita@kubric.io"
	},
	{
		description: "folder will store more confidential information",
		created_time: "2018-08-16T09:57:08.551000",
		url: "None",
		id: "fc7748f7-feee-4829-a2d0-e4e909a43597",
		user_id: "vinita@kubric.io",
		type: "folder",
		path: "/root1/71698bc1-cfc7-438c-93d1-04b0663571f3",
		name: "myfolder1",
		owner: "vinita@kubric.io"
	},
	{
		description: "folder will store confidential information",
		created_time: "2018-08-16T09:56:56.088000",
		url: "None",
		id: "71698bc1-cfc7-438c-93d1-04b0663571f3",
		user_id: "vinita@kubric.io",
		type: "folder",
		path: "/root1",
		name: "myfolder",
		owner: "vinita@kubric.io"
	}
];

class ImageCustomTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 5
		};
	}

	onSelected(data, index) {
		this.setState({
			selected: index
		});
		this.props.onSelected && this.props.onSelected(index);
	}

	render() {
		console.log(this.props.images);
		return <MediaGrid media={[...this.props.images, ...this.props.folders]} selected={this.state.selected} onSelected={::this.onSelected} />;
	}
}

class ImageGridTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 0
		};
	}

	onSelected(data, index) {
		this.setState({
			selected: index
		});
		this.props.onSelected && this.props.onSelected(data, index);
	}

	render() {
		return <MediaGrid type={this.props.type} media={this.props.media} selected={this.state.selected} onSelected={::this.onSelected} />;
	}
}

class ImageGridMultipleTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: ["https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg", "https://www.w3schools.com/css/trolltunga.jpg"],
			images: [...images]
		};
	}

	onUnselected(data) {
		this.setState({
			selected: this.state.selected.filter(selection => selection !== data)
		});
		this.props.onUnselected && this.props.onUnselected(data);
	}

	onSelected(data) {
		this.setState({
			selected: [...this.state.selected, data]
		});
		this.props.onSelected && this.props.onSelected(data);
	}

	onLoadNext() {
		const _this = this;
		setTimeout(() => {
			_this.setState({
				images: [...this.state.images, ...images]
			});
		}, 2000);
	}

	render() {
		const { type } = this.props;
		return type === "infinite" ? (
			<InfiniteMediaGrid
				media={this.state.images}
				selected={this.state.selected}
				onLoadNext={::this.onLoadNext}
				onSelected={::this.onSelected}
				onUnselected={::this.onUnselected}
				multiple={true}
				theme={styles}
			/>
		) : (
			<MediaGrid
				media={this.state.images}
				selected={this.state.selected}
				onSelected={::this.onSelected}
				onUnselected={::this.onUnselected}
				multiple={true}
			/>
		);
	}
}

storiesOf("MediaGrid", module)
	.add("Default", () => <MediaGrid onSelected={action("Scene selected")} media={images} />)
	.add("Testing", () => (
		<MediaGrid
			onSelected={action("Scene selected")}
			media={[
				{
					type: "image",
					url: "https://static.pexels.com/photos/34950/pexels-photo.jpg",
				},
				{
					type: "image",
					url: "https://static.pexels.com/photos/34950/pexels-photo.jpg",
				}
			]}
		/>
	))
	.add("Default Video", () => <MediaGrid onSelected={action("Scene selected")} media={videos} type="video" />)
	.add("Single selection", () => (
		<ImageGridTest
			onSelected={action("Scene selected")}
			media={images}
			selected="'https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg'"
		/>
	))
	.add("Single selection video", () => (
		<ImageGridTest
			type="video"
			onSelected={action("Scene selected")}
			media={videos}
			selected="'https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg'"
		/>
	))
	.add("Multiple selection", () => <ImageGridMultipleTest onSelected={action("Scene selected")} onUnselected={action("Scene unselected")} />)
	.add("Infinite scroll", () => <ImageGridMultipleTest type="infinite" onSelected={action("Scene selected")} onUnselected={action("Scene unselected")} />)
	.add("With custom image elements", () => <ImageCustomTest onSelected={action("Scene selected")} folders={folders} images={customImages} />);
