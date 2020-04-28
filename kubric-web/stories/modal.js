import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Modal from '../browser/js/components/commons/Modal';

storiesOf('Modal', module)
  .add('Default', () => (
      <Modal onHide={action('modal hidden')} visible={true}>
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque.
          Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In
          erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula.
          Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula.
          Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales
          sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris
          efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl.
          Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla,
          rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Modal>
    )
  )
  .add('Transparent shim', () => (
      <Modal onHide={action('modal hidden')} layer="transparent" visible={true}>
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque.
          Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In
          erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula.
          Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula.
          Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales
          sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris
          efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl.
          Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla,
          rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.
        </div>
      </Modal>
    )
  );