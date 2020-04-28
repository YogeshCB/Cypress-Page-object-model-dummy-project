import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Slider from '../../browser/js/components/commons/Slider';
import styles from './styles.scss';

const children = [
  <div className={styles.page} style={{ color: 'red' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
    pulvinar vel metus nec
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
    rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.</div>,
  <div className={styles.page} style={{ color: 'blue' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Quisque pulvinar vel metus nec
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
    rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.</div>,
  <div className={styles.page} style={{ color: 'green' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Quisque pulvinar vel metus
    nec
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
    rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.</div>,
  <div className={styles.page} style={{ color: 'violet' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Quisque pulvinar vel metus
    nec
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
    rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.</div>
];

class SliderTest extends Component {
  state = {
    page: 1,
  };

  render() {
    const _this = this;
    const { type = 'horizontal' } = this.props;
    return (
      <div>
        <Slider theme={styles} page={this.state.page} type={type}>{children}</Slider>
        <button onClick={() => _this.setState({
          page: _this.state.page + 1,
        })}>Move +
        </button>
        <button onClick={() => _this.setState({
          page: _this.state.page - 1,
        })}>Move -
        </button>
      </div>
    );
  }
}

storiesOf('Slider', module)
  .add('Default', () => <Slider theme={styles}>{children}</Slider>)
  .add('PageMoveHorizontal', () => <SliderTest/>)
  .add('PageMoveVertical', () => <SliderTest type='vertical'/>);