import { h } from "preact";

import { storiesOf } from "@storybook/react";
import ImageGrid from "../browser/js/components/commons/ImageGrid";

storiesOf("ImageGrid", module).add("Default", () => (
	<ImageGrid
		selectedIds={[2, 1]}
		offset={100}
		data={[
			{ url: "https://static.pexels.com/photos/34950/pexels-photo.jpg", id: 0 },
			{ url: "https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg", id: 1 },
			{ url: "https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg", id: 2 }
		]}
	/>
));
