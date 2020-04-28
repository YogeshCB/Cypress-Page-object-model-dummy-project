import { Component, h } from "preact";
import Canvas from "./Canvas";
import config from "../../../config";
import styles from "./style";

export default class Editor extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { asset, onModified, onSave, showGrid, grid } = this.props;
		const { enableCropper } = this.state;
		return (
			<div className={styles.editorContainer}>
				<Canvas asset={asset} onModified={onModified} enableCropper={enableCropper} showGrid={showGrid} grid={grid} />
				<div className={styles.editorTools}>
					<button
						onClick={() => {
							this.setState({ enableCropper: !this.state.enableCropper });
						}}>
						{!enableCropper ? "Crop" : "Back"}
					</button>
					{onSave && <button onClick={onSave}>Save</button>}
				</div>
			</div>
		);
	}
}
