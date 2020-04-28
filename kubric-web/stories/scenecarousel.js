import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SceneCarousel from '../browser/js/components/SceneCarousel';

const scenes = [{
  screenshot: 'https://static.pexels.com/photos/34950/pexels-photo.jpg',
  time: 0,
}, {
  screenshot: 'https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg',
  time: 15,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2016/03/28/12/35/cat-1285634_1280.png',
  time: 43,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2014/05/07/06/44/animal-339400_1280.jpg',
  time: 59,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2014/05/23/12/06/cat-351926_1280.jpg',
  time: 80,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2017/10/02/21/31/cat-2810383_1280.jpg',
  time: 119,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2012/11/26/13/58/cat-67345_1280.jpg',
  time: 124,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2017/10/27/09/38/halloween-2893710_1280.jpg',
  time: 178,
}, {
  screenshot: 'https://cdn.pixabay.com/photo/2017/10/20/09/54/halloween-2870607_1280.jpg',
  time: 190,
}, {
  screenshot: 'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg',
  time: 202,
}, {
  screenshot: 'https://www.w3schools.com/css/trolltunga.jpg',
  time: 234,
}];

class SceneCarouselTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    }
  }

  onSceneSelected(data, index) {
    this.setState({
      selected: index,
    });
    this.props.onSceneSelected && this.props.onSceneSelected(index);
  }

  render() {
    return (
      <SceneCarousel scenes={this.props.scenes} selected={this.state.selected}
                     onSelected={::this.onSceneSelected}/>
    )
  }
}

storiesOf('SceneCarousel', module)
  .add('Default', () => (
    <SceneCarousel onSceneSelected={action('Scene selected')} scenes={scenes}/>
  ))
  .add('Preselected', () => (
    <SceneCarouselTest onSceneSelected={action('Scene selected')} scenes={scenes}/>
  ));