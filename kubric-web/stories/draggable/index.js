import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';

import Draggable from '../../browser/js/components/commons/hoc/Draggable';
import Video from "../../browser/js/components/commons/media/Video";
import Image from "../../browser/js/components/commons/media/Image";
import styles from './styles.scss';

storiesOf('Draggable', module)
  .add('Default', () => (
    <Draggable style={{ width: "10rem", height: "10rem" }}>
      <div style={{ width: "100%", height: "100%", background: "#ffff00" }}/>
    </Draggable>
  ))
  .add('Video', () => <Video media="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                             modal={true} theme={styles}/>)
  .add('Image', () => <Image
    image="https://storage.googleapis.com/videos-kubric/-353585758/-1707426365/lord_of_the_cheese/image83147355.png"
    modal={true} theme={styles}/>);