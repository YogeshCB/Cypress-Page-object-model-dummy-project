import { h, Component, cloneElement } from 'preact';
import baseStyles from '@bit/kubric.components.styles.commons';

export default ComponentToMix => {
  return class VisibilityClass extends Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: this.props.visible || false,
      }
    }

    show() {
      this.setState({
        visible: true,
      });
    }

    hide() {
      this.setState({
        visible: false,
      });
    }

    componentWillReceiveProps(nextProps) {
      if (typeof nextProps.visible !== 'undefined') {
        this.setState({
          visible: nextProps.visible,
        });
      }
    }

    render() {
      return (
        <ComponentToMix {...this.props} {...this.state} show={::this.show}
                        hide={::this.hide}/>
      );
    }
  }
};
