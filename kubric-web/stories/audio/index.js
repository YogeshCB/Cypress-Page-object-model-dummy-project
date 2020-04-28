import { h } from 'preact';
import { storiesOf } from '@storybook/react';
import Audio from '../../browser/js/components/commons/media/Audio';
import styles from './styles.scss';

const data = {
  "asset_type": "audio",
  "attribution": "<a href=\"id\" target=\"_blank\">Jingle Punks</a> / <a href=\"https://youtube.com\" target=\"_blank\">youtube</a>",
  "length": 87.216,
  "tags": ["Organ", "Electric Guitar", "Drums", "Bass", "Happy", "Reggae"],
  "title": "No Pressha",
  "media": "https://storage.googleapis.com/asset-library.appspot.com/aa5a6e25-a69e-4ba9-b2d2-cb21ea194bf2.mp3"
};

storiesOf('Audio', module)
  .add('Default', () => (
    <Audio theme={styles} {...data} hoverPlay={true}/>
  ));