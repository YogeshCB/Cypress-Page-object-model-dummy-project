import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Field from '../browser/js/components/commons/Field';

storiesOf('Field', module)
  .add('Input with value', () => (
    <Field name="field" value='testing' onChange={action('Input changed')} label={'Input label'}/>
  ))
  .add('Input with hint and no value', () => (
    <Field name="field" value='' onChange={action('Input changed')} hint={'Input hint'}/>
  ))
  .add('Input with hint and value', () => (
    <Field name="field" value='testing' onChange={action('Input changed')} hint={'Input hint'}/>
  ))
  .add('Input without value', () => (
    <Field name="field" onChange={action('Input changed')} label={'Input label'}/>
  ))
  .add('Input with icon', () => (
    <Field name="field" value='testing' icon onChange={action('Input changed')}/>
  ))
  .add('Errored field', () => (
    <Field name="field" onChange={action('Input changed')} label={'Input label'} error={"Is not valid"}/>
  ))
  .add('Errored field with value', () => (
    <Field name="field" onChange={action('Input changed')} value="testing" label={'Input label'}
           error={"Is not valid"}/>
  ))
  .add('Multiline field', () => (
    <Field name="field" onChange={action('Input changed')} multiline={true} value="testing" label={'Input label'}
           error={"Is not valid"}/>
  ))
  .add('Simple field', () => (
    <Field name="field" style='simple' onChange={action('Input changed')} multiline={true} value="testing"
           label={'Input label'}
           error={"Is not valid"}/>
  ));