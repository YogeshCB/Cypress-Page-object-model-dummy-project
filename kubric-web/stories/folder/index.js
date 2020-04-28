import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Folder from '../../browser/js/components/commons/media/folder';

const folder = {
  "description": "folder will store more and more confidential information",
  "created_time": "2018-08-16T09:57:22.834000",
  "url": "None",
  "id": "3990f2f0-0f45-4bc8-9e3c-f933f871282a",
  "user_id": "vinita@kubric.io",
  "asset_type": "folder",
  "path": "/root1/71698bc1-cfc7-438c-93d1-04b0663571f3/fc7748f7-feee-4829-a2d0-e4e909a43597",
  "name": "myfolder2",
  "owner": "vinita@kubric.io"
}

const size = {
  w: 160,
  h: 160
}

const performAction = (action) => {
  console.log(action);
}


storiesOf('Folder', module)
  .add('Default', () => (
    <Folder performAction={performAction} name={folder.name} size={size} folder={folder} view={'tiles'}/>
  ));