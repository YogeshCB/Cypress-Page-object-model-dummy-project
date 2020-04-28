import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { StaticField } from "../browser/js/components/commons/misc";

storiesOf('StaticField', module)
  .add('default', () => (
    <StaticField label="attributes" value="Test"/>
  ));