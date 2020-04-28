import { h } from 'preact';
import Field from '../Field';
import styles from 'stylesheets/components/commons/filterpanel';
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import { keyCodes } from "../../../lib/constants";

export default ({ config, onChange, value, placeholder = '', theme = {}, hidelabel = false }) => {
  const styler = new StyleExtractor(styles, theme);
  const onKeyUpHandler = e => {
    e.stopPropagation();
    if (e.keyCode === keyCodes.ENTER) {
      setImmediate(onChange, config, e.target.value);
    }
  };
  return (
    <div className={styler.get('input')}>
      {!hidelabel ? <div className={styles.label}>{config.label}</div> : ''}
      <Field placeholder={placeholder} style="simple" value={value} onKeyUp={onKeyUpHandler}
             theme={{ input: styler.get('inputfield') }}/>
    </div>
  );
}