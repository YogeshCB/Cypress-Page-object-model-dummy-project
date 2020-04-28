import { h } from 'preact';

import { storiesOf } from '@storybook/react';

import Carousel from '../browser/js/components/commons/Carousel';

const sizeStyles = {
  height: '15rem',
  width: '25rem',
};

storiesOf('Carousel', module)
  .add('Default', () => (
    <Carousel isLoading={true}>
      <div style={{ ...sizeStyles, backgroundColor: 'red' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'green' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'blue' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'black' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'violet' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'red' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'green' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'blue' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'black' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'violet' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'red' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'green' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'blue' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'black' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'violet' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'red' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'green' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'blue' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'black' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'violet' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'red' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'green' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'blue' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'black' }}/>
      <div style={{ ...sizeStyles, backgroundColor: 'violet' }}/>
    </Carousel>
  ));