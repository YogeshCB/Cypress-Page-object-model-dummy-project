import { h } from "preact";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import AlphaPicker from "../browser/js/components/commons/AlphaPicker";

storiesOf("AlphaPicker", module).add("Default", () => <AlphaPicker alpha={"33"} color={"#122122"} />);
