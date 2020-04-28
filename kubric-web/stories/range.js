import { h } from "preact";
import { storiesOf } from "@storybook/react";
import { Range } from "../browser/js/components/commons/Range";

storiesOf("Range", module).add("Default", () => <Range min={-2} max={4} step={0.2} value={0} />);
