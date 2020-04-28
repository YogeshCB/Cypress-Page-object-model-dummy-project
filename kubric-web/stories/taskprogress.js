import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TaskProgress from '../browser/js/components/commons/TaskProgress';

storiesOf('TaskProgress', module)
  .add('default', () => (
    <TaskProgress data={{
      title: 'Task Title',
      desc: 'This is a very long task description',
      progress: 30,
      count: '10/20',
    }}/>
  ))
  .add('error', () => (
    <TaskProgress data={{
      title: 'Task Title',
      hasErred: true,
      error: 'This task has erred',
      desc: 'This is a very long task description',
      progress: 30,
      count: '10/20',
    }} allowRetry={true} onRetry={action('retry')}/>
  ));