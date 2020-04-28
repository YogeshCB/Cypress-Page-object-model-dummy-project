import { h, Component } from "preact";
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import { isFunction } from "@bit/kubric.utils.common.lodash";

export default class Selectable extends Component {
	render() {
		const { children, theme = {}, selectedElement, selected = false, data, onSelected, onUnselected, onClick, onSelect } = this.props;
		const styler = new StyleExtractor({}, theme);
		if (selected && onSelect && isFunction(onSelect)) {
			onSelect();
		}
		const clickHandler = e => {
			let handler = selected ? onUnselected : onSelected;
			if (isFunction(onClick)) {
				handler = onClick;
			}
			isFunction(handler) && setImmediate(handler, data, e);
		};

		return (
			<div style={{ position: "relative" }} className={styler.get("container")} onClick={clickHandler}>
				<div
					className={styler.get("contents")}
					ref={input => {
						this.nameInput = input;
					}}>
					{children}
				</div>
				{selected ? selectedElement : <span />}
			</div>
		);
	}
}
