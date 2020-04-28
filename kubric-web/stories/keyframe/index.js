import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import styles from './styles.scss';
import Keyframes from '../../browser/js/components/KeyFrame';

const frameObjects = [{
  "type": "background",
  "url": "https://images.unsplash.com/photo-1505904909252-8ce17de9f287?w=654"
}, {
  "type": "image",
  "position": { "x": 150, "y": 0 },
  width: 200,
  height: 200,
  "background": "#ffffff",
  url: "https://images.unsplash.com/photo-1505904909252-8ce17de9f287?w=654",
}, {
  "type": "text",
  "text": "HELLO WORLD",
  "position": { "x": 200, "y": 100 },
}];

storiesOf('Keyframes', module)
  .add('Default', () => (
    <Keyframes objects={frameObjects} onImageSelected={action('Image selected')} onTextChange={action('text changed')}
               theme={styles}/>
  ));