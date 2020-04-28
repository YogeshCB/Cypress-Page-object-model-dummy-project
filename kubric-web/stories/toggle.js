import { h, Component } from "preact";
import { storiesOf } from "@storybook/react";
import { Toggle } from "../browser/js/components/commons/Toggle";

storiesOf("Toggle", module)
	.add("On State", () => (
		<Toggle
			onValue={1}
			offValue={0}
			value={1}
			onChange={value => {
				console.log(value);
			}}
		/>
	))
	.add("Off State", () => (
		<Toggle
			onValue={1}
			offValue={0}
			value={0}
			onChange={value => {
				console.log(value);
			}}
		/>
	));
