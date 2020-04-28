import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import VideoCard from '../../browser/js/components/commons/VideoCard';
import styles from './styles.scss';

storiesOf('VideoCard', module)
  .add('Default', () => (
    <VideoCard media={'https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-Sample-576p.mp4'}
               onPlayPause={action('video clicked')} theme={styles}>
      Jophin Joseph
    </VideoCard>
  ));