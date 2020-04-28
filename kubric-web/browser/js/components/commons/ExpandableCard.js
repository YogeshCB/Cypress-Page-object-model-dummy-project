import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/expandablecard';

export default class ExpandableCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: !!props.expanded,
    };
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded,
    });
    this.props.onClick && this.props.onClick();
  }

  componentWillReceiveProps({ expanded }) {
    typeof expanded !== 'undefined' && this.setState({
      expanded,
    });
  }

  render() {
    const { children, theme = {} } = this.props;
    return (
      <div
        className={`${theme.expandable || ''} ${styles.expandable} ${this.state.expanded ? `${theme.expanded} ${styles.expanded}` : ''}`}
        onClick={::this.toggle}>
        {children}
      </div>
    );
  }
}