import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Seekbar from '../browser/js/components/commons/SeekBar';

storiesOf('Seekbar', module)
  .add('Default', () => <Seekbar progress={40} onSeeked={action('seeked')}/>);