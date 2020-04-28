import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/slider';

export default class Slider extends Component {
  setDisplacement(currentPage) {
    let { page = 0, type = 'horizontal' } = this.props;
    page = typeof currentPage === 'undefined' ? page : currentPage;
    const maxPage = this.props.children.length - 1;
    page = (page > maxPage) ? maxPage : ((page < 0) ? 0 : page);
    if (type === 'horizontal') {
      this.setState({
        displacement: -(page * this.windowWidth),
        prop: 'left',
      });
    } else {
      this.setState({
        displacement: -(page * this.windowHeight),
        prop: 'top',
      });
    }
  }

  componentDidMount() {
    const _this = this;
    setTimeout(() => {
      const dimensions = _this.sliderNode.getBoundingClientRect();
      _this.windowWidth = dimensions.width;
      _this.windowHeight = dimensions.height;
      _this.setDisplacement();
    });
  }

  componentWillReceiveProps({ page }) {
    typeof page !== 'undefined' && this.windowWidth && this.setDisplacement(page);
  }

  render() {
    const { children = [], theme = {}, type = 'horizontal' } = this.props;
    const { displacement = 0, prop = 'left' } = this.state;
    const dispStyle = {
      [prop]: `${displacement}px`,
    };
    return (
      <div className={`${styles.slider} ${theme.slider || ''}`} ref={node => this.sliderNode = node}>
        <span style={dispStyle} className={`${styles.scroller} ${styles[type]}`}>
          {children.map(child => <div>{child}</div>)}
        </span>
      </div>
    );
  }
}