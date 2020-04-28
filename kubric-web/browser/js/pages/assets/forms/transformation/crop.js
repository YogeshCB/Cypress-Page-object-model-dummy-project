import { h } from 'preact';
import styles from 'stylesheets/assets/transform';

export default ({  onTransformChange, transform }) => {
  const { x0, y0, x1, y1 } = transform;

    return <div className={styles.input}>
      <div className={styles.numericInput}> 
        <label className={styles.label}>X0</label>
        <div className={styles.number}>
          <input min="0" value={x0} type="number" className={styles.field}
          onChange={(e) => onTransformChange({ x0: e.target.value })}/>      
        </div>
      </div>
      <div className={styles.numericInput}> 
        <label className={styles.label}>X1</label>
        <div className={styles.number}>
          <input min={x0} value={x1} type="number" className={styles.field}
          onChange={(e) => onTransformChange({ x1: e.target.value })}/>    
        </div>
      </div>
      <div className={styles.numericInput}> 
        <label className={styles.label}>Y0</label>
        <div className={styles.number}>
          <input min="0" value={y0} type="number" className={styles.field}
          onChange={(e) => onTransformChange({ y0: e.target.value })}/>
        </div>
      </div> 
      <div className={styles.numericInput}> 
        <label className={styles.label}>Y1</label>
        <div className={styles.number}>
          <input min={y1} value={y1} type="number" className={styles.field}
          onChange={(e) => onTransformChange({ y1: e.target.value })}/>
        </div>
      </div>
  </div>
}