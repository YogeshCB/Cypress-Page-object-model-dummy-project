import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Editor from '../browser/js/components/commons/RichTextEditor';

class EditorTest extends Component {
  state = {
    "value": "This is the brief for the text",
    "colors": {
      "background": "#ffffff",
      "text": "#000000"
    },
    "decorators": ["bold", "italic"]
  };

  onChange(value) {
    this.setState({
      value,
    });
  }

  onColorChange(type, color) {
    this.setState({
      colors: {
        ...this.state.colors,
        [type]: color,
      },
    });
  }

  onDecorationChange(decoration) {
    if (this.state.decorators.indexOf(decoration) > -1) {
      this.setState({
        decorators: this.state.decorators.filter(seldecoration => seldecoration !== decoration),
      });
    } else {
      this.setState({
        decorators: [...this.state.decorators, decoration],
      });
    }
  }

  render() {
    return <Editor data={this.state} onChange={::this.onChange} onColorChange={::this.onColorChange}
                   onDecorationChange={::this.onDecorationChange}/>
  }
}

storiesOf('Editor', module)
  .add('Input with value', () => (
    <EditorTest/>
  ));