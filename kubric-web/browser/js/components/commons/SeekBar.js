import { h, Component } from 'preact';
import ProgressBar from './ProgressBar';
import { getLeftPosition } from "@bit/kubric.utils.common.dom";
import styles from 'stylesheets/components/commons/seekbar';

export default class SeekBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: props.progress || 0,
    };
  }

  componentWillReceiveProps({ progress }) {
    typeof progress !== 'undefined' && this.setState({
      progress,
    });
  }

  onMouseDown(e) {
    e.stopPropagation();
    const { onSeeked } = this.props;
    const totalWidth = this.seeker.offsetWidth;
    const clickedPos = event.clientX - getLeftPosition(this.seeker);
    const clickedPercent = clickedPos / totalWidth;
    this.setState({
      progress: clickedPercent * 100,
    });
    onSeeked && onSeeked(clickedPercent);
  }

  render() {
    const { progress } = this.state;
    const { className } = this.props;
    return (
      <div className={`${styles.seekbar} ${className}`} ref={node => this.seeker = node}
           onMouseDown={::this.onMouseDown}>
        <ProgressBar show={true} progress={progress}/>
      </div>
    );
  }
}
