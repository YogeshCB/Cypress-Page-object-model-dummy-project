import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/menu';
import baseStyles from '@bit/kubric.components.styles.commons';
import { getPosition } from "@bit/kubric.utils.common.dom";

export const MenuItem = ({ className = '', children, onClick, theme = {}, disabled = false }) => (
  <div className={`${theme.menuItem || ''} ${styles.menuItem} ${className} ${disabled ? styles.disabledMenuItem : ''}`} onClick={onClick}>
    {children}
  </div>
);

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible || false,
      position: {
        top: '-100rem',
      },
    };
  }

  toggleVisibility(fireEvent, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const newVisible = !this.state.visible;
    this.setState({
      visible: newVisible,
    });
    if (newVisible && !this.props.keepOpen) {
      document.querySelector('body').addEventListener('click', this.onHideHandler);
    }
    fireEvent && this.props.onToggled && this.props.onToggled(newVisible);
  }

  onHide() {
    this.setState({
      visible: false,
    });
    this.props.onHide && this.props.onHide();
    this.documentBody.removeEventListener('click', this.onHideHandler);
  }

  setPosition() {
    const { orientation = 'bottom-left' } = this.props;
    if (this.menuContainer) {
      const previousHeight = this.containerHeight;
      this.containerHeight = this.menuContainer.offsetHeight;
      const previousPosition = this.menuPosition;
      this.menuPosition = getPosition(this.menuContainer);
      if (
        previousHeight !== this.containerHeight ||
        previousPosition.top !== this.menuPosition.top ||
        previousPosition.left !== this.menuPosition.left ||
        previousPosition.bottom !== this.menuPosition.bottom
      ) {
        if (orientation === 'bottom-left') {
          this.setState({
            position: {
              top: `${this.containerHeight + this.menuPosition.top - 4}px`,
              left: `${this.menuPosition.left + 4}px`,
            }
          });
        } else if (orientation === 'bottom-right') {
          this.setState({
            position: {
              top: `${this.containerHeight + this.menuPosition.top - 4}px`,
              right: `${window.innerWidth - this.menuPosition.right}px`,
            }
          });
        }
      }
    }
  }

  componentDidMount() {
    this.documentBody = document.querySelector('body');
    this.onHideHandler = ::this.onHide;
    this.setPosition();
  }

  componentDidUpdate() {
    this.setPosition();
  }

  componentWillReceiveProps({ visible }) {
    typeof visible !== 'undefined' && visible !== this.state.visible && this.toggleVisibility(false);
  }

  render() {
    const { visible, position = {} } = this.state;
    const { iconElement = <span/>, children, header, theme: customStyles = {}, active = true } = this.props;
    return (
      <div className={`${styles.menuContainer} ${customStyles.container || ''} ${visible ? styles.opened : ''}`}
           ref={node => this.menuContainer = node}>
        {header? header: ''}
        {active ? (
          <span onClick={this.toggleVisibility.bind(this, true)} className={styles.iconContainer}>
          {iconElement}
        </span>) : null}
        <div style={position}
             className={`${customStyles.menu || ''} ${styles.menu} ${customStyles.menu || ''} ${!visible ? baseStyles.hide : ''}`}>{children}</div>
      </div>
    );
  }
}
