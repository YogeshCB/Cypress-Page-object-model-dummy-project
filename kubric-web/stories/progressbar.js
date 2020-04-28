import { h, Component } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ProgressBar from '../browser/js/components/commons/ProgressBar';
import theme from '../browser/stylesheets/campaign/creatives/progressbaroverride.scss';

storiesOf('ProgressBar', module)
  .add('Progressbar', () => {
    const ProgressTest = class Test extends Component {
      state = {
        progress: 0,
      };

      componentDidMount() {
        const _this = this;
        setTimeout(() => {
          _this.setState({
            progress: 80,
          });
        }, 1000);
      }

      render() {
        return (
          <div>
            <ProgressBar progress={this.state.progress} show={true} theme={theme}/>
          </div>
        )
      }
    };

    return <ProgressTest/>
  });