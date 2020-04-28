import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Drawer from '../browser/js/components/commons/Drawer';

class Test extends Component {
  state = {
    visible: false,
  };

  onHide() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <div>
        <button onClick={::this.onHide}>Toggle</button>
        <Drawer heading="Filters" show={this.state.visible} onHide={::this.onHide}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris arcu tortor, eleifend nec pharetra vel,
          rhoncus id arcu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus non turpis sit amet
          sapien pulvinar laoreet ut in erat. Donec purus orci, malesuada eget pharetra et, placerat quis risus.
          Curabitur non lobortis sem. Proin ante turpis, placerat a vestibulum ac, ullamcorper a lectus. Fusce placerat
          lectus vel velit condimentum, ac elementum leo mollis.

          Curabitur laoreet tortor vitae mollis hendrerit. Pellentesque eget nibh commodo nibh eleifend blandit sodales
          at orci. Cras quis magna nibh. Duis iaculis purus purus, ut maximus augue auctor ut. Praesent ut arcu augue.
          Mauris nec dui vitae ex gravida euismod. Vestibulum maximus aliquet augue lobortis mollis. Donec sodales risus
          nec quam mattis, sit amet consequat felis semper. Nulla eu libero malesuada, ultrices eros eget, maximus enim.
          Nulla iaculis tincidunt dolor vitae suscipit. In hac habitasse platea dictumst. Morbi bibendum enim vel
          porttitor accumsan. Aenean gravida malesuada turpis non aliquet.

          Duis iaculis vestibulum urna, et finibus magna viverra nec. Proin vulputate, ante ac sollicitudin venenatis,
          lorem nisi posuere est, non dignissim mauris urna a nunc. Donec ultricies tincidunt euismod. Vestibulum ante
          ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis lacinia nibh quis sodales
          iaculis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean
          aliquet sollicitudin nisi, nec aliquam ipsum sodales eget. In quis mollis urna. Aliquam viverra neque mattis
          nisi dignissim interdum. Vestibulum at ante sem. Aenean in felis ut orci iaculis sagittis vel ullamcorper
          odio. Donec efficitur ut enim sit amet gravida. Ut varius sodales ultricies. Integer ullamcorper laoreet
          accumsan.
        </Drawer>
      </div>
    );
  }
}

storiesOf('Drawer', module)
  .add('Default', () => <Test/>);