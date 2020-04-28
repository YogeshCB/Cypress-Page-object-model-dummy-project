import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import SearchBox from '@bit/kubric.components.commons.searchbox';

class SearchBoxTest extends Component {
  state = {
    source: [{
      label: 'Occasion',
      value: 'occasion',
      data: {
        id: 'occasion',
      }
    }, {
      label: 'Demographics',
      value: 'demographics',
      data: {
        id: 'demo',
      }
    }, {
      label: 'Location',
      value: 'location',
      data: {
        id: 'location',
      }
    }],
    selected: [{
      label: 'Occasion',
      value: 'occasion',
      data: {
        id: 'occasion',
      }
    }],
    isLoading: false,
  };

  onChange() {
    this.setState({
      isLoading: true,
    });
    setTimeout(() => {
      this.setState({
        isLoading: false,
        source: [...this.state.source, ...this.state.source],
      });
    }, 3000);
  }

  onSelected(value) {
    this.setState({
      selected: [...this.state.selected, value],
    });
  }

  onDeleted(value) {
    this.setState({
      selected: this.state.selected.filter(selectedVal => value.value !== selectedVal.value),
    });
  }

  render() {
    return (
      <SearchBox required label='Choose Attributes' source={this.state.source} value={this.state.selected}
                 isLoading={this.state.isLoading} onChange={::this.onChange} showSelected={this.props.showSelected}
                 onSelected={::this.onSelected} onDeleted={::this.onDeleted} freeEntry={this.props.freeEntry}/>
    );
  }
}

class TagsTest extends Component {
  state = {
    selected: ['test'],
  };

  onSelected(value) {
    this.setState({
      selected: [...this.state.selected, value],
    });
  }

  onDeleted(value) {
    this.setState({
      selected: this.state.selected.filter(selectedVal => value !== selectedVal),
    });
  }

  render() {
    return (
      <SearchBox required label='Choose Attributes' value={this.state.selected} onSelected={::this.onSelected}
                 onDeleted={::this.onDeleted} freeEntry={true} showSelected={true}/>
    );
  }
}

storiesOf('SearchBox', module)
  .add('default', () => (
    <SearchBoxTest/>
  ))
  .add('Free entry', () => (
    <TagsTest/>
  ))
  .add('Show selected', () => (
    <SearchBoxTest showSelected={true}/>
  ));