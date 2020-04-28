import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Card from '../../browser/js/components/commons/Card';
import styles from './styles.scss';

const video1 = {
  image: "https://lh3.googleusercontent.com/xRLgFVl-4I4qTo0_Mpuc5pEvkPdLH0i8gLMbhCxIR9qC07tQG4oMnsCoSgiqaql3vPAJ2uVYjJ91WwdnLaaHdQ",
  name: 'Jophin Test',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.',
  id: 'video-id',
};

const video2 = {
  image: "https://lh3.googleusercontent.com/xRLgFVl-4I4qTo0_Mpuc5pEvkPdLH0i8gLMbhCxIR9qC07tQG4oMnsCoSgiqaql3vPAJ2uVYjJ91WwdnLaaHdQ",
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.',
  id: 'video-id',
};

const video3 = {
  image: "https://lh3.googleusercontent.com/xRLgFVl-4I4qTo0_Mpuc5pEvkPdLH0i8gLMbhCxIR9qC07tQG4oMnsCoSgiqaql3vPAJ2uVYjJ91WwdnLaaHdQ",
  name: 'Lorem ipsum dolor',
  desc: 'Lorem ipsum dolor',
  id: 'video-id',
};

const video4 = {
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.',
  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pulvinar vel metus nec pellentesque. Phasellus sed eros eget nisl cursus semper sed non turpis. In condimentum dui eget neque viverra pretium. In erat nisl, sollicitudin id scelerisque vel, finibus in ante. Nulla nec posuere sem, a hendrerit ligula. Pellentesque sodales, nulla eget dignissim laoreet, magna ante rutrum libero, eget luctus eros quam eu ligula. Donec vel risus sed ipsum aliquet tristique. Duis semper, neque gravida pharetra laoreet, lorem felis sodales sem, in laoreet dolor ipsum in ipsum. Maecenas lacus metus, ornare eget suscipit eu, tincidunt vel leo. Mauris efficitur sapien vel accumsan ultrices. Phasellus lacus tortor, semper eu gravida et, interdum maximus nisl. Donec hendrerit odio quis dictum laoreet. Nam dignissim magna eget dolor dictum suscipit. Cras quam nulla, rutrum eu nulla placerat, viverra euismod risus. Suspendisse ultrices ultrices nisi.',
  id: 'video-id',
};


const data = video2;

storiesOf('Card', module)
  .add('Overflowing desc', () => <Card className={styles.card} data={data} {...video1}
                                       onClick={action('video clicked')}/>)
  .add('Overflowing name', () => <Card className={styles.card} data={data} {...video2}
                                       onClick={action('video clicked')}/>)
  .add('No overflowing', () => <Card className={styles.card} data={data} {...video3}
                                     onClick={action('video clicked')}/>)
  .add('With progress', () => <Card className={styles.card} data={data} {...video3} progress={80}
                                    onClick={action('video clicked')}/>);