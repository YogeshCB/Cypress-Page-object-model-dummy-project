import { h } from 'preact';
import MediaGrid from './MediaGrid';
import styles from 'stylesheets/components/commons/imageselectionpanel';
import Image from './media/Image';
import Video from "./media/Video";
import Audio from "./media/Audio";

export default ({ media = [], label, maxPreview, maxCount, onClick, theme = {}, type = 'image' }) => {
  let remainingCount;
  if (typeof maxCount !== 'undefined') {
    media = media.slice(0, maxCount)
  }
  if (typeof maxPreview !== 'undefined') {
    remainingCount = media.length - maxPreview;
    media = media.slice(0, maxPreview);
  }
  const showAddImages = typeof maxCount === 'undefined' || media.length < maxCount;

  const imageElmts = media.map(
    (selection, index) => {
      if (typeof selection !== 'string') {
        type = selection.type || type;
        selection = selection.url;
      }
      if (type === 'image') {
        return (
          <Image image={selection} actionable={true} onClick={onClick.bind(null, index)}/>
        );
      } else if (type === 'video') {
        return (
          <Video hoverable={false} card={false} hideControls={true} hoverPlay={true} media={selection} onClick={onClick.bind(null, index)}
                 theme={{ container: theme.videoContainer }}/>
        );
      } else if (type === 'audio') {
        return (
          <Audio hoverPlay={true} media={selection} hideControls={true} preload="none"
                 onClick={onClick.bind(null, index)} theme={{ container: theme.videoContainer }}/>
        );
      }
    }
  );
  const onAdd = () => showAddImages && this.props.onAdd();
  if (remainingCount && remainingCount > 0) {
    imageElmts.push(
      <div className={styles.addImage} onClick={onAdd}>+{remainingCount}</div>
    );
  } else if (showAddImages) {
    imageElmts.push(
      <div className={styles.addImage} onClick={onAdd}>+ ADD</div>
    );
  }
  return (
    <div className={`${styles.panel} ${theme.panel || ''}`}>
      {label ? <label className={styles.label}>{label}</label> : <span/>}
      <MediaGrid media={imageElmts} selectable={false}/>
    </div>
  );
};