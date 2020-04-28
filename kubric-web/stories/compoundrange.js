import { h, Component } from "preact";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import CompoundRange from "../browser/js/components/commons/CompoundRange";

storiesOf("CompundRange", module).add("Default", () => <CompoundRange min={0} max={1} step={0.1} value={0.5} val1={0} val2={0.9} />);
