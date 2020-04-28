import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EmbeddedSelector from '../../browser/js/components/commons/EmbeddedSelector';
import styles from './styles.scss';

const options = [{
  label: 'Publish to your own account',
  value: 'account',
  data: {
    name: 'Jophin Joseph',
    id: 12345678,
  }
}, {
  label: 'Publish to a group',
  value: 'group',
  data: {
    name: 'Jophin Joseph',
    id: 12345678,
  }
}, {
  label: 'Publish to a page',
  value: 'page',
  data: {
    name: 'Jophin Joseph',
    id: 12345678,
  }
}, {
  label: 'Publish to an event',
  value: 'event',
  data: {
    name: 'Jophin Joseph',
    id: 12345678,
  }
}];

storiesOf('Embedded selector', module)
  .add('default', () => (
    <EmbeddedSelector options={options} onSelected={action('option selected')}/>
  )).add('With scroll', () => (
  <EmbeddedSelector options={[...options, ...options, ...options]} onSelected={action('option selected')}
                    theme={styles}/>
));