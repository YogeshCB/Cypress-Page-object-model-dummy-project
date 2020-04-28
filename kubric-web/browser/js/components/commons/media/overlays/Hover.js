import { h } from "preact";
import styles from "stylesheets/components/commons/media/overlays/hover";
import fonts from "stylesheets/icons/fonticons";
import { StaticField } from "../../misc";

export default ({ data = {}, onSelected, onClick }) => (
	<div className={`${styles.hoverable}`} onClick={onClick}>
		{onSelected && <span onClick={onSelected} className={fonts.fonticonCheck} />}
		{data.url ? (
			<span>
				<StaticField
					label=""
					theme={styles}
					enableCopy
					showLabel={false}
					value={data.url.indexOf("https://lh3") > -1 || data.url.indexOf("http://lh3") > -1 ? data.url + "=s0" : data.url}
				/>
			</span>
		) : null}
	</div>
);
