import { h, Component } from "preact";
import styles from "stylesheets/components/commons/imagegrid";
import { LazyImage } from "../LazyImage";
import Selectable from "../hoc/Selectable";
import Selected from "./overlay";

export default class Imagegrid extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedIds.toString() === this.props.selectedIds.toString()) {
			this.forceUpdate();
		}
	}
	render() {
		const { data, onSelect, onUnselect, selectedIds = [], from = 0, to = data.length } = this.props;
		return (
			<section className={styles.container}>
				<div
					className={styles.grid}
					ref={ref => {
						this.container = ref;
					}}>
					{data.slice(from, to).map((asset, index) => {
						const isSelected = selectedIds.includes(asset.id);
						const onClick = () => {
							if (isSelected) {
								onUnselect(asset);
							} else {
								onSelect(asset);
							}
						};

						return (
							<Selectable theme={{ container: styles.selectedParent }} selected={isSelected} onClick={onClick} selectedElement={<Selected />}>
								<div key={`${asset.id}${index}`} className={`${styles.imageContainer}`}>
									<LazyImage className={styles.image} src={asset.url} offset={500} />
								</div>
							</Selectable>
						);
					})}
				</div>
			</section>
		);
	}
}
