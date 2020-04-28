import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Tabs, Tab } from '../browser/js/components/commons/Tabs';

class LoadingTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: [true, true, true, true, true],
    }
  }

  onTabOpened(tabName, index, id) {
    this.state.isLoading[index] = false;
    const _this = this;
    setTimeout(() => _this.setState(_this.state), 4000);
  }

  render() {
    const [loading1, loading2, loading3, loading4, loading5] = this.state.isLoading;
    return (
      <Tabs onTabOpened={::this.onTabOpened}>
        <Tab name="Tab 1" tabid="Tab1" isLoading={loading1}>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec
            pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque
            viverra
            pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit
            ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam
            eu
            ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem
            felis
            sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel
            leo.
            Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum
            maximus
            nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam
            nulla,
            rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
          </div>
        </Tab>
        <Tab name="Tab 2" tabid="Tab2" isLoading={loading2}>
          <div>ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec
            pellentesque.
            Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In
            erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula.
            Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu
            ligula.
            Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis
            sodales
            sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo.
            Mauris
            efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl.
            Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla,
            rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
          </div>
        </Tab>
        <Tab name="Tab 3" tabid="Tab3" isLoading={loading3}>
          <div>dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque.
            Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In
            erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula.
            Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu
            ligula.
            Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis
            sodales
            sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo.
            Mauris
            efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl.
            Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla,
            rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
          </div>
        </Tab>
        <Tab name="Tab 4" tabid="Tab4" isLoading={loading4}>
          <div>sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus
            sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat
            nisl,
            sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque
            sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel
            risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in
            laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris
            efficitur
            sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec
            hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum
            eu
            nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
          </div>
        </Tab>
        <Tab name="Tab 5" tabid="Tab5" isLoading={loading5}>
          <div>amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed
            eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl,
            sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque
            sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel
            risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in
            laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris
            efficitur
            sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec
            hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum
            eu
            nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
          </div>
        </Tab>
      </Tabs>
    );
  }
};

storiesOf('Tabs', module)
  .add('Default', () => (
    <Tabs onTabOpened={action('tabopened')}>
      <Tab name="Tab 1">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec
          pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque
          viverra
          pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit
          ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam
          eu
          ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem
          felis
          sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel
          leo.
          Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum
          maximus
          nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam
          nulla,
          rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Tab>
      <Tab name="Tab 2">
        <div>ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec
          pellentesque.
          Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In
          erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula.
          Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu
          ligula.
          Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis
          sodales
          sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo.
          Mauris
          efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl.
          Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla,
          rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Tab>
      <Tab name="Tab 3">
        <div>dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque.
          Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In
          erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula.
          Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu
          ligula.
          Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis
          sodales
          sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo.
          Mauris
          efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl.
          Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla,
          rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Tab>
      <Tab name="Tab 4">
        <div>sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus
          sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat
          nisl,
          sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque
          sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel
          risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in
          laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris
          efficitur
          sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec
          hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum
          eu
          nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Tab>
      <Tab name="Tab 5">
        <div>amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed
          eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl,
          sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque
          sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel
          risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in
          laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris
          efficitur
          sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec
          hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum
          eu
          nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Tab>
    </Tabs>
  ))
  .add('Loading', () => <LoadingTest/>);