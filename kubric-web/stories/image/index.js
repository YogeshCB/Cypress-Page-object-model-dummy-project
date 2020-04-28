import { h } from 'preact';

import { storiesOf } from '@storybook/react';

import Image from '../../browser/js/components/commons/media/Image';
import theme from './styles.scss';

storiesOf('Image', module)
  .add('Default', () => <Image image='http://eurodroid.com/pics/sony_ericsson_x10_photo_camera-samples_2.jpg'
                               theme={theme}/>)
  .add('With text', () => <Image image='http://eurodroid.com/pics/sony_ericsson_x10_photo_camera-samples_2.jpg'
                                 theme={theme} text='#trending'/>);