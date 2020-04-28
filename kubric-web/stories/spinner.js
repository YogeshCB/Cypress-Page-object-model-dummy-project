import { h } from 'preact';

import { storiesOf } from '@storybook/react';

import { Spinner } from "../browser/js/components";

storiesOf('Spinner', module)
  .add('Default', () => <Spinner/>);