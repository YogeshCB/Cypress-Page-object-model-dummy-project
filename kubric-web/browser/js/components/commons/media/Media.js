import { h, Component } from 'preact';
import { getMediaTime } from '../../../lib/utils';
import { debounce } from '@bit/kubric.utils.common.lodash';

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      isLoading: !props.media,
      media: props.media,
      durationString: getMediaTime(typeof props.length !== 'undefined' ? props.length : 0),
      endTime: props.endTime,
      startTime: props.startTime || 0,
      timeString: getMediaTime(typeof props.startTime !== 'undefined' ? props.startTime : 0),
    };
    this.onMouseEnter = debounce(Media.onMouseEnter.bind(this), props.playDebounce);
    this.onMouseLeave = debounce(Media.onMouseLeave.bind(this), props.playDebounce);
  }

  getProgress(currentTime) {
    if (this.mediaNode) {
      const time = (currentTime || this.mediaNode.currentTime);
      const duration = this.mediaNode ? this.mediaNode.duration : 0;
      const progress = (time / duration) * 100;
      if (currentTime) {
        this.mediaNode.currentTime = currentTime;
      }
      return {
        progress,
        timeString: getMediaTime(time),
      };
    } else {
      return {
        progress: 0,
        timeString: '0:00',
      };
    }
  }

  onPlayPause(isPlayingNext) {
    const { onPlayPause } = this.props;
    const { isPlaying } = this.state;
    isPlayingNext = typeof isPlayingNext !== 'undefined' ? isPlayingNext : !isPlaying;
    if (this.mediaNode) {
      const setState = () => {
        this.setState({
          isPlaying: isPlayingNext,
        });
        onPlayPause && onPlayPause(isPlayingNext);
      };
      const promise = this.mediaNode[!isPlayingNext ? 'pause' : 'play']();
      promise ? promise.then(setImmediate(setState)).catch(console.error) : setState();
    }
  }

  componentWillReceiveProps({ media, startTime, endTime }) {
    this.setState({
      isLoading: !media,
      media,
      startTime: startTime || 0,
      endTime: endTime ? endTime : (this.mediaNode ? this.mediaNode.duration : 0),
    });
    startTime && this.setState(this.getProgress(startTime));
  }

  onSeeked(percent) {
    if (this.mediaNode) {
      const duration = this.mediaNode.duration;
      let { startTime, endTime, isPlaying } = this.state;
      let newTime = duration * percent;
      if (newTime < startTime || newTime > endTime) {
        newTime = startTime;
        percent = 0;
        isPlaying = false;
        this.mediaNode.pause();
      }
      this.mediaNode.currentTime = newTime;
      this.setState({
        progress: percent * 100,
        isPlaying,
      });
    }
  }


  onTimeUpdate() {
    const { endTime, startTime } = this.state;
    this.mediaNode && endTime && this.mediaNode.currentTime >= endTime ? this.resetMedia(startTime) : this.setState(this.getProgress());
  }

  resetMedia(toTime) {
    this.mediaNode.currentTime = toTime || 0;
    this.mediaNode.pause();
    this.setState({
      isPlaying: false,
      progress: 0,
    });
  }

  onEnded() {
    this.resetMedia();
  }

  onLoaded() {
    this.setState({
      ...this.getProgress(this.state.startTime),
      ready: true,
      durationString: this.mediaNode !== null && getMediaTime(this.mediaNode.duration),
    });
    this.props.onLoaded && this.props.onLoaded(this, this.mediaNode);
  }

  setControlsVisible(isVisible) {
    const { hideControls = false, hideAll = false } = this.props;
    this.setState({
      controlsVisible: !(hideControls || hideAll) && isVisible,
    });
  }

  onClick(e) {
    e.preventDefault();
    const _this = this;
    this.setControlsVisible(true);
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(() => _this.setControlsVisible(false), 3000);
    this.props.onClick && this.props.onClick(e);
  }

  static onMouseEnter(e) {
    this.setControlsVisible(true);
    this.props.hoverPlay && this.onPlayPause(true);
    this.props.onMouseEnter && this.props.onMouseEnter(e);
  }

  static onMouseLeave(e) {
    this.setControlsVisible(false);
    this.props.hoverPlay && this.onPlayPause(false);
    this.props.onMouseLeave && this.props.onMouseLeave(e);
  }
}
