import { h } from 'preact';
import styles from 'stylesheets/assets/transform';
import Checkbox from '../../../../components/commons/Checkbox';

export default ({  onTransformChange, transform, width, height }) => {
  const { resize = { w: width, h: height, as: ''} } = transform;  
  
  const aspectRatio = width/height;

  return <div className={styles.resize}>
  <div className={styles.dimensions}>
    <div className={styles.numericInput}> 
      <label className={styles.label}>Width</label>
      <div className={styles.number}>
        <input type="number" value={parseInt(resize.w)} max={width} onChange={(e)=>onTransformChange({ resize: { ...resize, w:e.target.value, h:resize.as === 'n'?resize.h:e.target.value/aspectRatio } })}  min={1} className={styles.field} />
        <span className={styles.unit}>px</span>
      </div>
    </div>
    <div className={styles.numericInput}> 
      <label className={styles.label}>Height</label>
      <div className={styles.number}>
        <input type="number" value={parseInt(resize.h)} max={height} onChange={(e)=>onTransformChange({ resize: { ...resize, h:e.target.value, w:resize.as === 'n'?resize.w:e.target.value/aspectRatio } })} min={1} className={styles.field}/>
        <span className={styles.unit}>px</span>
      </div>         
    </div>
  </div>
  {/* 
    <div className={`${styles.numericInput} ${styles.resizeInput}`}> 
      <label className={styles.label}>Scale</label>
      <div className={styles.number}>
        <input type="number" value={100} max={100} onChange={(e)=>onTransformChange({ resize: { ...resize, w:e.target.value } })}  min={1} className={styles.field} />
        <span className={styles.unit}>%</span>
      </div>
    </div> */}
    <Checkbox label='Lock Aspect Ratio' value={resize.as} checked={resize.as===''} onChange={(e)=>onTransformChange({ resize: { ...resize, as: e ? '' :'n' } })}/>
  </div>
}