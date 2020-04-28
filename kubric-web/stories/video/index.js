import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Video from '../../browser/js/components/commons/media/Video';
import styles from './styles.scss';

storiesOf('Video', module)
  .add('Default', () => <Video media={'https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-Sample-576p.mp4'}
                               onPlayPause={action('video clicked')} className={styles.video}/>)
  .add('Starting time', () => <Video media={'https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-Sample-576p.mp4'}
                                     onPlayPause={action('video clicked')} className={styles.video} startTime={60}/>)
  .add('Constrained video', () => <Video
    media={'https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-Sample-576p.mp4'}
    onPlayPause={action('video clicked')} className={styles.video} startTime={13} endTime={20}/>)
  .add('Hover play', () => <Video
    media={'https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-Sample-576p.mp4'}
    onPlayPause={action('video clicked')} className={styles.video} hoverPlay={true} hideControls={true}/>);