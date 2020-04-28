import { h } from "preact";

import { storiesOf } from "@storybook/react";

import Joyful from "../browser/js/components/commons/Joyful";

storiesOf("Joyful", module).add("Default", () => <Joyful onMove={o => console.log(o)} />);
