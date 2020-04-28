import { h } from 'preact';
import styles from 'stylesheets/components/commons/media/video';
import baseStyles from '@bit/kubric.components.styles.commons';
import Seekbar from '../SeekBar';
import Media from './Media';
import Attribution from './AttributionText';
import MediaCard from './MediaCard';
import Draggable from '../hoc/Draggable';

export default class Video extends Media {
  render() {
    const {
      showLoading = false, className = '', theme = {}, hoverPlay, showDuration = false, thumbnail, muted = true,
      preload = 'metadata', attribution, hideAll = false, file_type, filename, hideControls, shrinkOptions, style, modal = false
    } = this.props;

    const { isPlaying, isLoading, progress, media, timeString, durationString, controlsVisible } = this.state;

    const videoElmt = (
      <div className={`${theme.container || ''} ${styles.videoContainer} ${className}`} onClick={::this.onClick}
           onMouseEnter={::this.onMouseEnter} onMouseLeave={::this.onMouseLeave} style={style}>
        <div className={`${styles.videoCard} ${theme.videoCard}`}>
          <video className={`${styles.video} ${theme.video}`} src={media} preload={preload} poster={thumbnail}
                 muted={muted} ref={node => this.mediaNode = node} onTimeUpdate={::this.onTimeUpdate}
                 onEnded={::this.onEnded} onLoadedData={::this.onLoaded}/>
          {(hoverPlay && !isPlaying) ? <div className={`${styles.iconVideoPlay} ${styles.hoverVideoPlay}`}/> : <span/>}
          {(hoverPlay && !hideAll) || showDuration ?
            <div className={`${styles.hoverDuration} ${theme.hoverDuration}`}>{durationString}</div> : <span/>}
          {attribution && attribution.text && attribution.text.length > 0 ?
            <Attribution position="top right">{attribution.text}</Attribution> : <span/>}
          {!(hideControls || hideAll) ? (
            <div
              className={`${baseStyles.overlay} ${styles.overlay} ${(!isPlaying || controlsVisible) ? styles.visible : ''}`}>
              <div className={styles.actions}>
                <div className={`${isPlaying ? styles.iconVideoPause : styles.iconVideoPlay}`}
                     onClick={this.onPlayPause.bind(this, undefined)}/>
                <div className={styles.timeString}>{timeString} / {durationString}</div>
              </div>
              <Seekbar progress={progress} onSeeked={::this.onSeeked} className={styles.seekbar}/>
              {(showLoading && isLoading) ? <div className={styles.iconVideoLoading}/> : null}
            </div>
          ) : <span/>}
        </div>
        <MediaCard onClick={::this.onClick} theme={shrinkOptions ? { name: styles.name } : {}} file_type={file_type} filename={filename}/>
      </div>
    );

    return modal ? <Draggable theme={{ container: theme.modalContainer }}
                              loaded={this.state.ready}>{videoElmt}</Draggable> : videoElmt;
  }
}
