import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Accordion from '../../browser/js/components/commons/Accordion';

class Test extends Component {
  onClick(index) {
    this.setState({
      current: index,
    })
  }

  render() {
    return (
      <Accordion current={this.state.current} onSelect={::this.onClick}>
        <div name="Location" isLoading={true}>Lorem Ipsu "Neque porro quisquam est qui dolorem ipsum quia dolor sit
          amet, consectetur,
          adipisci velit..."There is no one who loves pain itself, who seeks after it and wants to have it, simply
          because
          it is pain..."Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nisi sed neque finibus
          aliquam
          sit amet et magna. Nullam tempus nec nisl sit amet congue. In tincidunt ornare commodo. Sed at turpis dolor.
          Nullam eu tempor nulla, sit amet mollis neque. Duis mauris tortor, sodales a orci nec, condimentum interdum
          est.
          Praesent dignissim at tortor eget tempus. Nulla vitae ultrices urna, sit amet egestas mauris. Donec tempor
          vehicula tempor. In iaculis purus nec enim ornare tincidunt. Duis pretium interdum velit quis molestie. Mauris
          id augue vulputate, commodo elit sed, rhoncus risus. Aliquam eu lobortis metus. Suspendisse sed iaculis
          sapien,
          eget malesuada ante. Morbi vitae magna non tellus consectetur ornare a nec lacus. Curabitur non augue non
          mauris
          consectetur ultricies.Nullam sed leo tortor. Etiam id porta sem. Mauris a nunc ante. Cras accumsan pulvinar
          rutrum. Mauris a fringilla magna, sit amet porttitor tellus. Etiam at imperdiet dui. Donec malesuada ac nisl
          ut
          interdum. Suspendisse interdum augue et venenatis suscipit. Nam sed interdum sapien. Mauris lorem erat,
          convallis sed rutrum at, mollis nec tortor. Etiam non ipsum dignissim, vulputate nisi vitae, scelerisque
          ipsum.
        </div>
        <div name="Occasion">Lorem Ipsu "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,
          adipisci velit..."There is no one who loves pain itself, who seeks after it and wants to have it, simply
          because
          it is pain..."Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nisi sed neque finibus
          aliquam
          sit amet et magna. Nullam tempus nec nisl sit amet congue. In tincidunt ornare commodo. Sed at turpis dolor.
          Nullam eu tempor nulla, sit amet mollis neque. Duis mauris tortor, sodales a orci nec, condimentum interdum
          est.
          Praesent dignissim at tortor eget tempus. Nulla vitae ultrices urna, sit amet egestas mauris. Donec tempor
          vehicula tempor. In iaculis purus nec enim ornare tincidunt. Duis pretium interdum velit quis molestie. Mauris
          id augue vulputate, commodo elit sed, rhoncus risus. Aliquam eu lobortis metus. Suspendisse sed iaculis
          sapien,
          eget malesuada ante. Morbi vitae magna non tellus consectetur ornare a nec lacus. Curabitur non augue non
          mauris
          consectetur ultricies.Nullam sed leo tortor. Etiam id porta sem. Mauris a nunc ante. Cras accumsan pulvinar
          rutrum. Mauris a fringilla magna, sit amet porttitor tellus. Etiam at imperdiet dui. Donec malesuada ac nisl
          ut
          interdum. Suspendisse interdum augue et venenatis suscipit. Nam sed interdum sapien. Mauris lorem erat,
          convallis sed rutrum at, mollis nec tortor. Etiam non ipsum dignissim, vulputate nisi vitae, scelerisque
          ipsum.Lorem Ipsu "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit..."There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is
          pain..."Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non nisi sed neque finibus aliquam sit
          amet et magna. Nullam tempus nec nisl sit amet congue. In tincidunt ornare commodo. Sed at turpis dolor.
          Nullam
          eu tempor nulla, sit amet mollis neque. Duis mauris tortor, sodales a orci nec, condimentum interdum est.
          Praesent dignissim at tortor eget tempus. Nulla vitae ultrices urna, sit amet egestas mauris. Donec tempor
          vehicula tempor. In iaculis purus nec enim ornare tincidunt. Duis pretium interdum velit quis molestie. Mauris
          id augue vulputate, commodo elit sed, rhoncus risus. Aliquam eu lobortis metus. Suspendisse sed iaculis
          sapien,
          eget malesuada ante. Morbi vitae magna non tellus consectetur ornare a nec lacus. Curabitur non augue non
          mauris
          consectetur ultricies.Nullam sed leo tortor. Etiam id porta sem. Mauris a nunc ante. Cras accumsan pulvinar
          rutrum. Mauris a fringilla magna, sit amet porttitor tellus. Etiam at imperdiet dui. Donec malesuada ac nisl
          ut
          interdum. Suspendisse interdum augue et venenatis suscipit. Nam sed interdum sapien. Mauris lorem erat,
          convallis sed rutrum at, mollis nec tortor. Etiam non ipsum dignissim, vulputate nisi vitae, scelerisque
          ipsum.
        </div>
        <div name="Product">Lorem Ipsu "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,
          adipisci velit...
        </div>
        <div name="Language">Lorem Ipsu "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,
          adipisci velit..."There is no one who loves pain itself, who seeks after it and wants to have
        </div>
      </Accordion>
    )
  }
}

storiesOf('Accordion', module)
  .add('Default', () => (<Test/>));