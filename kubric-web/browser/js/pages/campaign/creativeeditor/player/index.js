import { h } from 'preact';
import Player from '../../../../components/Player';
import styles from 'stylesheets/campaign/creative/player';
import Controller from './Controller';

export default props => {
  const { shots, resolvedShots, selectedShot, onPreviewPlay, onPreviewPause, controller } = props;
  return (
    <Player {...props} showShots={false} selectedShot={selectedShot} shots={shots} theme={styles}
            resolvedShots={resolvedShots} onPlay={onPreviewPlay} onPause={onPreviewPause}
            controls={controller ? <Controller/> : <span/>} controlsPosition={"top"}/>
  );
}