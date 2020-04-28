import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/richtexteditor';
import ColorSelector from './ColorSelector';

export default ({ onChange, onDecorationChange, onColorChange, data = {} }) => (
  <div className={styles.editor}>
    <div className={styles.toolbar}>
      <button
        className={`${styles.decoration} ${styles.bold} ${data.decorators.indexOf('bold') > -1 ? styles.decorationSelected : ''}`}
        onClick={onDecorationChange.bind(null, 'bold')}>B
      </button>
      <button
        className={`${styles.decoration} ${styles.italic} ${data.decorators.indexOf('italic') > -1 ? styles.decorationSelected : ''}`}
        onClick={onDecorationChange.bind(null, 'italic')}>I
      </button>
      <div className={`${styles.color} ${styles.textcolor}`}>
        <div>Text</div>
        <ColorSelector selected={data.colors.text || '#000000'} onSelected={onColorChange.bind(null, 'text')}/>
      </div>
      <div className={`${styles.color} ${styles.bgcolor}`}>
        <div>Background</div>
        <ColorSelector selected={data.colors.background || '#ffffff'}
                       onSelected={onColorChange.bind(null, 'background')}/>
      </div>
    </div>
    <div>
      <textarea cols='30' rows='10' value={data.value} onChange={onChange}
                style={{ color: data.colors.text, background: data.colors.background }}
                className={`${styles.textarea} ${data.decorators.map(dec => styles[dec]).join(' ')}`}/>
    </div>
  </div>
);