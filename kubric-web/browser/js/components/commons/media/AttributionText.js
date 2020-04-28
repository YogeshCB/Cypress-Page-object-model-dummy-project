import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/media/attribution';

export default class AttributionText extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.children[0] !== nextProps.children[0];
  }

  render() {
    const { children, position = 'bottom right', onClick } = this.props;
    return (
      <div  onClick={onClick} className={`${styles.attribution} ${position.split(' ').map(pos => styles[pos]).join(' ')}`}
           dangerouslySetInnerHTML={{ __html: children }}/>
    )
  }
}