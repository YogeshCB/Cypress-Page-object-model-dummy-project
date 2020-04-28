import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ColorPalette from '../browser/js/components/commons/ColorPalette';

class ColorTest extends Component {
  onSelected(color) {
    this.setState({
      selected: color,
    });
  }

  render() {
    return (
      <ColorPalette visible={true} selected={this.state.selected} onSelected={::this.onSelected}/>
    );
  }
}

storiesOf('ColorPalette', module)
  .add('Default', () => (
    <ColorTest visible={true}/>
  ));