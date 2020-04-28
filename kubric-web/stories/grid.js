import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Grid from '../browser/js/components/commons/Table/index';

const headers = [{
  displayName: 'Name',
  data: 'name',
}, {
  displayName: 'Age',
  data: 'age',
}, {
  displayName: 'Bio',
  data: 'bio',
}, {
  displayName: 'Profession',
  data: 'profession',
}];

const headers2 = [{
  displayName: 'Name',
  data: 'name',
  cellId: 'name',
}, {
  displayName: 'Age',
  data: 'age',
}, {
  displayName: 'Bio',
  data: 'bio',
}, {
  content: data => [
    <button onClick={action('action_clicked')}>Action 1</button>,
    <button onClick={action('action_clicked')}>Action 2</button>,
  ],
  displayName: 'Profession',
  cellId: 'profession'
}];

const headers3 = [{
  displayName: 'Name',
  data: 'name',
  cellId: 'name',
}, {
  displayName: 'Age',
  data: 'age',
}, {
  displayName: 'Bio',
  data: 'bio',
}, {
  displayName: 'Aux',
  data: {
    from: 'auxes',
    key: 'aux.key',
    path: 'data',
    transformer: (data = '') => data.length > 0 ? data : '---'
  }
}];

const data = [{
  name: 'Jophin',
  age: 29,
  bio: 'bio',
  profession: 'test',
  aux: {
    key: '123'
  }
}, {
  name: 'austin',
  age: 9,
  bio: 'soft dev',
  profession: 'test',
}, {
  name: 'texas',
  age: 2,
  bio: 'hard dev',
  profession: 'test',
}, {
  name: 'boston',
  age: 19,
  bio: 'biobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobio',
  profession: 'test',
  aux: {
    key: '456'
  }
}, {
  name: 'usa',
  age: 15,
  bio: 'bio',
  profession: 'test',
}, {
  name: 'aus',
  age: 20,
  bio: 'gardener',
  profession: 'test',
}, {
  name: 'can' ,
  age: 16,
  bio: 'painter',
  profession: 'test',
}, {
  name: 'england',
  age: 21,
  bio: 'test',
  profession: 'test',
}, {
  name: 'america',
  age: 22,
  bio: 'dev',
  profession: 'test',
}, {
  name: 'Jophin',
  age: 23,
  bio: 'hello',
  profession: 'test',
}, {
  name: 'Jophin',
  age: 24,
  bio: 'bio new',
  profession: 'test',
}];

const loadingRows = [0, 2, {
  loading: true,
  index: 4,
  cells: {
    name: true,
    profession: true,
  }
}];

const auxData = {
  auxes: {
    123: {
      data: 'test',
    },
    456: {
      data: 'rest',
    }
  }
};

storiesOf('Grid', module)
  .add('Default', () => (
    <Grid headers={headers} onChange={action('changed')} data={data}/>
  ))
  .add('Action grid', () => (
    <Grid editable={true} headers={headers2} onChange={action('changed')} data={data}/>
  ))
  .add('Loading', () => (
    <Grid editable={true} loadingRows={loadingRows} selectable={true} headers={headers2} onChange={action('changed')}
          data={data}/>
  ))
  .add('Aux Data', () => (
    <Grid editable={true} headers={headers3} onChange={action('changed')} data={data} auxData={auxData}/>
  ))
  .add('Editable', () => (
    <Grid editable={true} headers={headers} onChange={action('changed')} data={data}/>
  ));