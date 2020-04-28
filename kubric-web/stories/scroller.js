import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';

import Scrollable from '../browser/js/components/commons/hoc/Scrollable';

class ScrollerTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  onLoadNext() {
    this.setState({
      loading: true
    });
    setTimeout(() => this.setState({
      loading: false
    }), 2000);
  }

  render() {
    const { loading } = this.state;
    const { direction = "down" } = this.props;
    return (
      <Scrollable loading={loading} onLoadNext={::this.onLoadNext} direction={direction}
                  style={{ border: "black", width: "50rem", height: "50rem" }}>
        <div style={{ background: "green", width: "50rem", height: "80rem" }}/>
      </Scrollable>
    );
  }
}

storiesOf('Scroller', module)
  .add('Scroll down', () => <ScrollerTest/>)
  .add('Scroll up', () => <ScrollerTest direction={"up"}/>);