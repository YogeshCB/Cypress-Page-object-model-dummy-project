import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styles from './styles.scss';
import FBVideoAd from '../../browser/js/components/commons/FBVideoAd';

storiesOf('FBVideoAd', module)
  .add('Default', () =>
    <div className={styles.container}>
      <FBVideoAd
        thumbnail="https://scontent-bom1-1.xx.fbcdn.net/v/t1.0-1/c10.0.100.100/p100x100/18893430_233798273786956_3919699110818491167_n.png?_nc_eui2=v1%3AAeEFwx6oEMS0FvX9IC9-cQ2LH5--J1FFzn1ryWHJ7QqmiTDopHFqo5OUYl05UP-9X-jcGNOt8EmzXX6Pr5E3NeiBhzUW8663BMKVRWbuwcRQAw&oh=6d6c3e0099d05675e605e312e09b788f&oe=5B3265EC"
        page="Dino Eggs" text="Testing the text" headline="Headline" description="This is the description of the video"
        video="https://d2qguwbxlx1sbt.cloudfront.net/TextInMotion-Sample-576p.mp4"
      />
    </div>
  );