import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import fontIcons from 'stylesheets/icons/fonticons';
import Filters from '../browser/js/components/TagFilters';
import TagFilterTypes from '../browser/js/components/TagFilterTypes';

const filters = [{
  name: 'Location',
  id: 'location',
  selected: ["Bangalore", "Delhi", 'Kochi', "Mumbai"],
  options: ["Bangalore", "Delhi", 'Kochi', "Mumbai"],
}, {
  name: 'Occasion',
  id: 'occasion',
  selected: ["Traffic", "Pollution"],
  options: ["Rains", "Traffic", "Pollution", "Onam", "New Year"],
}, {
  name: 'Product',
  id: 'product',
  selected: ["Mobilephones"],
  options: ["Earphones", "Headphones", "Mobilephones", "Gramaphones"],
}];

class Test extends Component {
  state = [...filters];

  onSelected(field, value) {
    console.log('selected', field, index);
    this.setState({
      selected: [...this.state.selected, index],
    });
  }

  onUnselected(field, value) {
    console.log('unselected', field, index);
    this.setState({
      selected: this.state.selected.filter(selection => selection !== index),
    });
  }

  render() {
    const { selected } = this.state;
    return <Filters filters={filters} onRemoveFilter={::this.onUnselected} onAddFilter={::this.onSelected}/>
  }
}


class TestTypes extends Component {
 state = {
   source: [{
       label: 'Type',
       value: 'type',
       input: 'multiple',
       editable: true,
       data: [{
         value: 'image',
         label: 'Image'
       }, {
         value: 'video',
         label: 'Video'
       }, {
         value: 'audio',
         label: 'Audio'
       }]
     }, {
       label: 'Owned By',
       value: 'private',
       input: 'single',
       editable: true,
       data: [{
         value: 'false',
         label: 'Public'
       }, {
         value: 'true',
         label: 'Me'
       }]
     }, {
       label: 'Aspect Ratio',
       value: 'as',
       input: 'multiple',
       editable: true,
       data: [{
         value: '16.9',
         label: '16x9'
       }, {
         value: '1.1',
         label: '1x1'
       }, {
         value: '2.1',
         label: '2x1'
       }, {
         value: '1.2',
         label: '1x2'
       }]
     }, 
     {
       label: 'Gender',
       value: 'gender',
       editable: true,
       input: 'multiple',
       data: [{
         value: 'male',
         label: 'Male'
       }, {
         value: 'female',
         label: 'Female'
       }]
     }
   ],
    selected: [],
    isLoading: false,
  };
  onSelected(value) {
    this.setState({
      selected: [...this.state.selected, value],
      isLoading: false
    });
  }

  searchList(value, arr) {
    for (let i = 0; i < arr.length; i++) {
      let matcher = new RegExp(value, "i");
      let found = matcher.test(arr[i].label);
      if (!found) {
        arr[i] = {
          ...arr[i],
          hide: true
        }
      } else {
        arr[i] = {
          ...arr[i],
          hide: false
        }
      }
    }
    return arr
  }

  showAll(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {
        ...arr[i],
        hide: false
      }
    }
    return arr;
  }

  onChange(value, innerList, selected) {
    this.setState({
      isLoading: false,
    });
    let { source = [] } = this.state;
    if (value.split(':')[1] && value.split(':')[1].length > 0 && innerList && innerList.length > 0) {
      let newData = this.searchList(value.split(':')[1], innerList);
      source[selected] = {
        ...source[selected],
          data: newData
        }
      this.setState({ 
        source: source
      })
    } 
    else{
    if(value==='' || typeof value === 'undefined'){
      source = this.showAll(source);
      this.setState({
        source: source
      })
    }
    else{
      this.setState({
        source: this.searchList(value, source)
      })
    }
  }
}

  onDeleted(value) {
    this.setState({
      selected: this.state.selected.filter(selectedVal => value.data.value !== selectedVal.data.value),
      isLoading: false
    });
  }

  render() {
    return (
      <TagFilterTypes icon={fontIcons.fonticonSearch} label='Search' source={this.state.source} selected={this.state.selected} 
      isLoading={this.state.isLoading} onChange={::this.onChange} showSelected={this.props.showSelected}
      onSelected={::this.onSelected}  onDeleted={::this.onDeleted} freeEntry={false}/>
    );
  }
}


storiesOf('TagFilters', module)
  .add('Default', () => (
    <Test/>
  ))
  .add('with Types', ()=>(
    <TestTypes showSelected={true}/>
  ))