import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Radio from '../browser/js/components/commons/Radio';


const options = [{
  label: 'New Campaign',
  value: 'new'
}, {
  label: 'Existing Campaign',
  value: 'existing',
}];

storiesOf('Radio', module)
  .add('Default', () => <Radio options={options} name="campaignType" onChange={action(`value changed`)}/>);