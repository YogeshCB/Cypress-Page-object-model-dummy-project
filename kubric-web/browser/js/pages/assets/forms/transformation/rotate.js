import { h } from 'preact'; 
import styles from 'stylesheets/assets/transform';
import appIcons from 'stylesheets/icons/app';
import { PrimaryButton } from '../../../../components/commons/misc';

export default ( { transform, onTransformChange } ) => {
    const { rotateBy } = transform;
    return  <div>
    <div className={styles.rotate}>
    <div className={styles.inputRange}>
      <input className={styles.rangeInput} type="range" min={-180} max={180} value={rotateBy}
             onChange={(e) => onTransformChange({ rotateBy: e.target.value })}/>
    </div>
    <div className={`${styles.number} ${styles.degreeNumber}`}>
      <input type="number" min={-180} onChange={(e) => onTransformChange({ rotateBy: e.target.value })} max={180} value={rotateBy} className={styles.field} />
      <span className={styles.unitDegree}>&deg;</span>
    </div>
    </div>
    {/*}
    <div className={styles.rotateAction}>
      <h4 className={styles.label}>Flip</h4>
      <div className={styles.rotateButtons}>      
        <PrimaryButton className={styles.rotateActionButton} onClick={onTransformChange.bind(null, { rotateBy: 180 })} theme={styles}>
          <span className={`${styles.icon} ${appIcons.iconHorizontalFlip}`}></span>
          &nbsp;Horizontal
        </PrimaryButton>
        <PrimaryButton className={styles.rotateActionButton} onClick={onTransformChange.bind(null, { rotateBy: 90 })} theme={styles}>
          <span className={`${styles.icon} ${appIcons.iconVerticalFlip}`}></span>
          &nbsp;Vertical
        </PrimaryButton>
      </div>
    </div>
*/}
  </div>
}