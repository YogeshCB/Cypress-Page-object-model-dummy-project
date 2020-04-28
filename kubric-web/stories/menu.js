import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { MenuItem, Menu } from '../browser/js/components/commons/Menu';
import { ProfileAvatar } from '../browser/js/components/commons/misc';

const getMenuItems = () => ([
  <MenuItem onClick={action('profile-click')}>Profile</MenuItem>,
  <MenuItem onClick={action('logout-click')}>Logout</MenuItem>
]);

storiesOf('ProfileIcon', module)
  .add('Default user icon', () => (
    <Menu iconElment={<ProfileAvatar/>}>{getMenuItems()}</Menu>
  ))
  .add('Image user icon', () => (
    <Menu iconElment={<ProfileAvatar
      pic="https://lh3.googleusercontent.com/-N6SwR5zj9Os/AAAAAAAAAAI/AAAAAAAAB9k/9-et6ACjZwY/s96-c/photo.jpg"/>}>{getMenuItems()}</Menu>
  ));