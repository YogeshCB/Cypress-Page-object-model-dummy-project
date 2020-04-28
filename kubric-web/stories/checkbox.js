import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Checkbox } from '../browser/js/components/commons/Checkbox';

storiesOf('Checkbox', module)
  .add('Default', () => (
    <Checkbox checked={true} onChange={action('changed')} label={"Label"}/>
  ))
  .add('Unchecked', () => (
    <Checkbox/>
  ));