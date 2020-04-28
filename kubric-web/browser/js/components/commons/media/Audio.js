import { h } from 'preact';
import styles from 'stylesheets/components/commons/media/audio';
import Media from './Media';
import Attribution from './AttributionText';
import fontIcons from 'stylesheets/icons/fonticons';
import appIcons from 'stylesheets/icons/app';
import MediaCard from './MediaCard';

export default class Audio extends Media {
  render() {
    const {
      tags = [], newAsset, preload = 'metadata', title, file_type, attribution = {}, theme = {}, className, filename,
      shrinkOptions
    } = this.props;
    const { media, isPlaying, timeString, durationString } = this.state;
    const playingClass = isPlaying ? `${appIcons.iconEqualizer} ${styles.iconPlaying}` : `${fontIcons.fonticonListen} ${styles.iconListen}`;
    return (
      <div className={`${className || ''} ${styles.container} ${theme.container || ''}`} onClick={::this.onClick}
           onMouseEnter={::this.onMouseEnter} onMouseLeave={::this.onMouseLeave}>
        {newAsset}
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.tags}>{tags.join(', ')}</div>
        </div>
        {attribution.text?<Attribution onClick={::this.onClick} position="bottom left">{attribution.text}</Attribution>:''}
        <audio onClick={::this.onClick} src={media} preload={preload} className={styles.audioTag}
               onTimeUpdate={::this.onTimeUpdate} onEnded={::this.onEnded} onLoadedData={::this.onLoaded}
               ref={node => this.mediaNode = node}/>
        <div onClick={::this.onClick} className={styles.iconContainer}>
          <div className={playingClass}/>
        </div>
        <div onClick={::this.onClick} className={`${theme.duration} ${styles.duration}`}>{timeString} / {durationString}</div>
        <MediaCard file_type={file_type} onClick={::this.onClick} theme={shrinkOptions? {...styles,name:styles.nameFont}:styles} filename={filename}/>
      </div>
    );
  }
};
