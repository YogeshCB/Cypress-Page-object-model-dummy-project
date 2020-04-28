import { h } from 'preact';
import styles from 'stylesheets/assets/transform';

export default ({ thumbnails, selected, onConfirmFilter }) => {
    return <div className={styles.thumbnails}>
      {thumbnails.map(thumb => {
        return <div className={styles.thumbnailContainer}
                    onClick={onConfirmFilter.bind(null, selected[0], (thumb.name).toLowerCase())}>
          <div className={styles.thumbnailOverlay}>{thumb.name}</div>
          <img className={styles.thumbnail} src={thumb.url}/>
        </div>
      })}
    </div>
}