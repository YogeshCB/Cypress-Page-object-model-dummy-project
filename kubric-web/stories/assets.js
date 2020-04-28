import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Assets from '../browser/js/components/Assets/index';

class AssetsTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toUpload: 0,
      uploaded: 0,
      isUploading: false,
      selected: [],
      data: {
        stock: {
          isLoading: true,
          images: [
            'https://static.pexels.com/photos/34950/pexels-photo.jpg',
            'https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg',
            'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg',
            'https://www.w3schools.com/css/trolltunga.jpg',
            'http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg',
            'http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
            'https://static.pexels.com/photos/302404/pexels-photo-302404.jpeg',
            'https://wallpaperscraft.com/image/parrot_love_branch_78610_1400x1050.jpg',
            'http://www.wallcoo.net/animal/Cute_Little_Birds_HD_Wallpapers_01/wallpapers/1024x768/Gorgeous_birds_Plain%20Prinia.jpg',
            'http://webneel.com/daily/sites/default/files/images/daily/03-2015/flowers%20colorful%20birds%20photography.preview.jpg',
            'https://static.pexels.com/photos/34950/pexels-photo.jpg',
            'https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg',
            'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg',
            'https://www.w3schools.com/css/trolltunga.jpg',
            'http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg',
            'http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
            'https://static.pexels.com/photos/302404/pexels-photo-302404.jpeg',
            'https://wallpaperscraft.com/image/parrot_love_branch_78610_1400x1050.jpg',
            'http://www.wallcoo.net/animal/Cute_Little_Birds_HD_Wallpapers_01/wallpapers/1024x768/Gorgeous_birds_Plain%20Prinia.jpg',
            'http://webneel.com/daily/sites/default/files/images/daily/03-2015/flowers%20colorful%20birds%20photography.preview.jpg',
          ],
        },
        scene: {
          isLoading: true,
          images: [
            'http://eurodroid.com/pics/sony_ericsson_x10_photo_camera-samples_2.jpg',
            'https://ergonotes.com/wp-content/uploads/2015/01/HTC-desire-eye-photo-sample-Digitaltrenda.jpeg',
            'https://i-cdn.phonearena.com/images/articles/278914-gallery/DSC-0022.JPG.jpg',
            'https://c1.staticflickr.com/5/4273/34645550480_c068961722_z.jpg',
            'http://cnet4.cbsistatic.com/hub/i/2014/04/14/cfb54af3-fb29-4347-ab79-d726d3b89cff/purple-flowers-sony-xperia-z2-test.jpg',
            'https://i-cdn.phonearena.com/images/articles/218136-gallery/Microsoft-Lumia-950-samples.jpg',
          ],
        },
        library: {
          isLoading: true,
          images: [
            'https://i.pinimg.com/736x/26/22/54/262254879b79326676695eba23297629--sony-cameras.jpg'
          ],
        },
      }
    }
  }

  onLoadNext(id, tabName, index) {
    const _this = this;
    setTimeout(() => {
      this.setState({
        data: {
          ..._this.state.data,
          [id]: {
            ..._this.state.data[id],
            images: [..._this.state.data[id].images, ..._this.state.data[id].images]
          }
        }
      });
    }, 2000);
  }

  onTabOpened(id, tabName, index) {
    const _this = this;
    setTimeout(() => {
      this.setState({
        data: {
          ..._this.state.data,
          [id]: {
            ..._this.state.data[id],
            isLoading: false,
          }
        }
      });
    }, 2000);
  }

  onFileSelected(files) {
    this.setState({
      toUpload: files.length,
      isUploading: true,
    });
    const _this = this;
    let intervalId = setInterval(() => {
      const newUploaded = _this.state.uploaded + 1;
      _this.setState({ uploaded: newUploaded });
      if (newUploaded === _this.state.toUpload) {
        clearInterval(intervalId);
        _this.setState({
          isUploading: false,
        });
      }
    }, 2000);
  }

  render() {
    const { selected, data, toUpload, uploaded, isUploading } = this.state;
    const { multipleSelection = true } = this.props;
    return (
      <Assets onLoadNext={::this.onLoadNext} selected={selected} data={data} multipleSelection={multipleSelection}
              onTabOpened={::this.onTabOpened} multipleUpload={true} onFileSelected={::this.onFileSelected}
              toUpload={toUpload} uploaded={uploaded} isUploading={isUploading}/>
    );
  }
}

storiesOf('Assets', module)
  .add('Multiple asset selection', () => (
    <AssetsTest multipleSelection={true}/>
  ))
  .add('Single asset selection', () => (
    <AssetsTest multipleSelection={false}/>
  ));