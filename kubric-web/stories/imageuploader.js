import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ImageUploader from '../browser/js/components/uploader/ImageUploader';

storiesOf('Image uploader', module)
  .add('Without value', () => (
    <ImageUploader onFileSelected={action('file selected')}/>
  ))
  .add('With value', () => (
    <ImageUploader onFileSelected={action('file selected')}
                   value={'https://lh3.googleusercontent.com/-N6SwR5zj9Os/AAAAAAAAAAI/AAAAAAAAB9k/9-et6ACjZwY/s96-c/photo.jpg'}/>
  ))
  .add('With progress', () => (
    <ImageUploader onFileSelected={action('file selected')} uploading={true} progress={50}/>
  ));