import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Selectbox from '../browser/js/components/commons/SelectBox';

const options = [{
  label: 'India',
  value: 'india',
}, {
  label: 'Sweden',
  value: 'sweden',
}, {
  label: 'Canada',
  value: 'canada',
}, {
  label: 'NL',
  value: 'nl',
}];

storiesOf('Selectbox', module)
  .add('Default', () => (
    <Selectbox options={options} name="selectbox" onChange={action('changed')} hint="value"/>
  ))
  .add('Disabled', () => (
    <Selectbox options={options} name="selectbox" onChange={action('changed')} hint="value" disabled={true}/>
  ))
  .add('With value', () => (
    <Selectbox options={options} name="selectbox" value='canada' onChange={action('changed')}/>
  ));