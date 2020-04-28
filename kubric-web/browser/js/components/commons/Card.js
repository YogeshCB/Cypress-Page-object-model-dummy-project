import { h, Component } from 'preact';
import MultiText from './MultiText';

import styles from 'stylesheets/components/commons/card';

export default ({ image, name, desc, data, onClick, className = '', progress, expandable = false }) => (
  <div className={`${styles.card} ${className}`} onClick={onClick && onClick.bind(null, data)}>
    {image ? <div className={styles.cover} style={{ backgroundImage: `url(${image})` }}/> : <span/>}
    <div className={styles.details}>
      {name ? <MultiText className={styles.name}>{name}</MultiText> : <span/>}
      {desc ? <MultiText
          className={styles.desc}>{desc}</MultiText> :
        <span/>}
      {progress ? <div className={styles.progress}>{progress}% complete</div> : <span/>}
    </div>
  </div>
);
