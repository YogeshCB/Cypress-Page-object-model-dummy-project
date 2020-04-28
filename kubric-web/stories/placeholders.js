import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
  ImagePlaceHolder,
  SceneCarouselPlaceholder,
  FramePlaceholder
} from '../browser/js/components/commons/Placeholders';

storiesOf('Placeholders', module)
  .add('Image', () => (
    <ImagePlaceHolder/>
  ))
  .add('SceneCarousel', () => (
    <SceneCarouselPlaceholder count={5}/>
  ))
  .add('Frame', () => (
    <FramePlaceholder/>
  ));