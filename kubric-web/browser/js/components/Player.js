import { h, Component } from 'preact';
import styles from 'stylesheets/components/player';
import baseStyles from '@bit/kubric.components.styles.commons';
import ResourceLoader from '@bit/kubric.media.video.resourceloader';
import VideoPreview from '@bit/kubric.components.video.preview';
import Carousel from './commons/Carousel';
import Image from './commons/media/Image';
import services from '../services';
import { isFunction, at } from '@bit/kubric.utils.common.lodash';
import appIcons from 'stylesheets/icons/app';

const CarouselCover = ({ children, orientation = 'vertical' }) =>
  orientation === 'vertical' ? <div className={styles.carousel}>{children}</div> : <Carousel>{children}</Carousel>;

const ShotsCarousel = ({ shots = [], selectedShot = 0, onShotSelected, orientation = 'vertical' }) => (
  <CarouselCover orientation={orientation}>
    {shots.map(({ defaultVideo = {} }, index) => (
      <Image
        image={defaultVideo.thumbnailURL}
        maintainAspectRatio={true}
        theme={{ container: `${styles.shotImage} ${selectedShot === index ? styles.selected : ''}` }}
        onClick={isFunction(onShotSelected) && onShotSelected.bind(null, index)}
        actionable={true}
      />
    ))}
  </CarouselCover>
);

const Overlay = ({ mode, handler, className }) => {
  let iconClass = appIcons.iconVideoPause;
  if (mode === 'play') {
    iconClass = appIcons.iconVideoPlay;
  }
  return (
    <div className={`${className} ${baseStyles.overlay}`} onClick={handler}>
      <div className={`${styles.overlayIcon} ${iconClass}`}/>
    </div>
  );
};

export default class Player extends Component {
  constructor() {
    super();
    this.state = {
      ready: false
    };
  }

  onReady() {
    this.setState({
      ready: true
    });
  }

  getCurrentThumbnail() {
    const { selectedShot = 0, shots } = this.props;
    const currentShot = shots[selectedShot];
    const size = at(currentShot, 'template.size')[0];
    const { w, h } = size;
    return {
      isWide: +w > +h,
      url: at(currentShot, `defaultVideo.thumbnailURL`)[0]
    };
  }

  render() {
    const {
      theme = {},
      controls,
      controlsPosition = "bottom",
      mode = 'all',
      shots = [],
      resolvedShots,
      currentShot = 0,
      showShots = true,
      orientation = 'vertical',
      playing = false,
      startedPlaying = false
    } = this.props;
    const { onPlay, onPause, onPlayingShotChanged } = this.props;
    const resourceLoader = new ResourceLoader(resolvedShots, { services });
    const thumbnail = shots.length > 0 && this.getCurrentThumbnail();
    const isStatic = shots.map(shot => shot.template.duration <= 1000);
    return (
      <div className={`${theme.container} ${!this.state.ready ? baseStyles.hide : ''} ${styles[orientation] || ''}`}>
        <div>
          {controlsPosition === "top" && (controls || <span/>)}
          <div
            className={`${theme.canvas} ${!isStatic[currentShot] ? styles.canvasPlayer : ''} ${controls ? '' : styles.nocontrols}`}>
            <div
              className={`${!startedPlaying && !isStatic[currentShot] ? baseStyles.hide : ''}  ${isStatic[currentShot] ? styles.templatePreview : styles.playerContainer}`}>
              <VideoPreview template={resolvedShots} loader={resourceLoader} current={currentShot}
                            playing={!isStatic[currentShot] ? playing : false} seekTo={0} live={isStatic[currentShot]}
                            onChange={onPlayingShotChanged} onReady={::this.onReady} mode={mode} loop={true}/>
              {!isStatic[currentShot] && (
                <Overlay
                  className={styles.hoverOverlay}
                  mode={playing ? 'pause' : 'play'}
                  handler={playing ? onPause : onPlay}
                />
              )}
            </div>
            {!playing && !startedPlaying && !isStatic[currentShot] ? (
              <div className={styles.thumbContainer}>
                <img className={`${styles.preview} ${thumbnail.isWide ? styles.fitWidth : styles.fitHeight}`}
                     src={thumbnail.url}/>
                <Overlay mode='play' handler={onPlay}/>
              </div>
            ) : <span/>}
          </div>
          {controlsPosition === "bottom" && (controls || <span/>)}
        </div>
        {showShots && shots.length > 0 ? (
          <ShotsCarousel shots={shots} selectedShot={currentShot} onShotSelected={onShotSelected}
                         orientation={orientation}/>
        ) : (
          <span/>
        )}
      </div>
    );
  }
}
