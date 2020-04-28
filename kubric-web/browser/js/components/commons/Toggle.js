import { h } from "preact";
import styles from "stylesheets/components/commons/toggle";
import { isFunction } from "@bit/kubric.utils.common.lodash";

export const Toggle = ({ theme = {}, onValue, offValue, value, onChange, hideLabel = false }) => {
	const switchOn = onValue === value;
	const toggledValue = !switchOn ? onValue : offValue;
	
	return (<div className={`${styles.container}`} onClick={()=>{isFunction(onChange) && onChange(toggledValue);}}>
		<label className={`${styles.switch} ${theme.switch}`}>
			<input
				type="checkbox"
				checked={switchOn}
				onChange={() => {
					isFunction(onChange) && onChange(toggledValue);
				}}
			/>
			<span className={`${styles.slider} ${switchOn?theme.sliderOn:theme.sliderOff} ${styles.round}`} />
		</label>
		{!hideLabel?<span className={`${styles.label}`}>{switchOn ? "On" : "Off"}</span>:''}
		</div>
	);
};
