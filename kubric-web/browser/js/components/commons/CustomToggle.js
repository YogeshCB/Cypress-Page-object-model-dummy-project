import { h } from "preact";
import styles from "stylesheets/components/commons/customtoggle";

export default ({ onChange, iconClassOn, iconClassOff, checked = false, label, id, theme }) => (
	<div
		className={`${styles.container} ${theme.customToggleContainer}`}
		onClick={() => {
			onChange(!checked);
		}}>
		{checked ? <div className={`${iconClassOn}`} /> : <div className={`${iconClassOff}`} />}
		<label for={id} className={`${styles.label} ${theme.label}`}>
			{label}
		</label>
	</div>
);
