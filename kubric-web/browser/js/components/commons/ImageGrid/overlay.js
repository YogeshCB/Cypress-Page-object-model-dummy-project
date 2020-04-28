import { h } from "preact";
import styles from "stylesheets/components/commons/imagegrid";
import fontIcon from "stylesheets/icons/fonticons";

export default () => (
	<div className={styles.selectedOverlay}>
		<div className={`${styles.tick} ${fontIcon.fonticonCheck}`} />
	</div>
);
