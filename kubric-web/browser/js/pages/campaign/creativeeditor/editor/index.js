import { h } from 'preact';
import Parameters from '../../../../components/Parameters';
import styles from 'stylesheets/campaign/creative/editor';
import ShotSelector from '../../../../components/ShotSelector';
import { SolidButton } from "../../../../components/commons/misc";
import Picker from '../../../Picker';

export default ({ parameterCount, onParameterChanged, uploadModalOpened, onShotSelected, onBulkCustomize, isPickerOpen, onGenerate, ...restProps }) => {
  const { bindings = [], selected } = restProps;
  return (
    <div className={`${styles.container}`}>
      {bindings.length > 1 ? <ShotSelector bindings={bindings} selected={selected} onSelected={onShotSelected}/> :
        <span/>}
      <Parameters {...restProps} currentBindings={bindings[selected]}
                  theme={{ container: `${styles.parameterContainer} ${bindings.length > 4 ? styles.twoline : ''}` }}/>
      <Picker isPickerOpen={isPickerOpen}/>
      <div className={styles.actions}>
        <SolidButton onClick={onGenerate}>Generate</SolidButton>
      </div>
    </div>
  );
}
