import { h } from 'preact';
import UnstyledSelectableGrid from "@bit/kubric.components.hoc.selectable";
import selectableStyles from "@bit/kubric.components.hoc.selectable/styles";

export const SelectableGrid = props => <UnstyledSelectableGrid styles={selectableStyles} {...props}/>;