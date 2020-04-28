import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Keywords from '../browser/js/components/commons/Keywords';

class KeywordsTest extends Component {
  state = {
    values: ['test', 'best'],
  };

  onAdd(value) {
    this.setState({
      values: [...this.state.values, value],
    });
  }

  onDelete(value) {
    this.setState({
      values: this.state.values.filter(keyword => keyword !== value),
    });
  }

  render() {
    return (
      <Keywords {...this.state} onAdd={::this.onAdd} onDelete={::this.onDelete}/>
    );
  }
}

storiesOf('Keywords', module)
  .add('Default', () => (
    <KeywordsTest/>
  ));