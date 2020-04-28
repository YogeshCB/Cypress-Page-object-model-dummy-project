import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Notifier from '../browser/js/components/commons/Notifier';

storiesOf('Notifier', module)
  .add('Default', () => (
    <Notifier notifications={[{
      id: 10,
      type: 'success',
      heading: 'Success',
      desc: 'This is a success',
    }, {
      id: 20,
      heading: 'Error',
      desc: 'It was a Friday, the most revered of all days amongst millennials. For me, that Friday was unlike any other Friday since the Friday I was born. The dejected countenance that accompanied me the whole day belied the composed exterior I tried to project. With it being a long weekend of 4 days, everyone around me revelled in joy. Had it been any other weekend, I too would have joined the merriments. The onus of the task that lay in store, weighed upon me.',
    }, {
      id: 20,
      type: 'warning',
      heading: 'Warning',
      desc: 'It was a Friday, the most revered of all days amongst millennials. For me, that Friday was unlike any other Friday since the Friday I was born. The dejected countenance that accompanied me the whole day belied the composed exterior I tried to project. With it being a long weekend of 4 days, everyone around me revelled in joy. Had it been any other weekend, I too would have joined the merriments. The onus of the task that lay in store, weighed upon me.',
    }]}/>
  ));