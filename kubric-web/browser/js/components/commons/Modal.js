import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/modal';
import baseStyles from '@bit/kubric.components.styles.commons';

export default class Modal extends Component {
  onHide() {
    const { hideOnLayerClick = true, onHide } = this.props;
    hideOnLayerClick && onHide && onHide();
  }

  static cancelClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMouseOverLayer() {
    const { mode, onHide } = this.props;
    mode === 'menu' && onHide && onHide();
  }

  _handleKeyDown = event => {
    if(event && event.keyCode === 9 && this.container && !this.container.contains(document.activeElement)){
      this.container.focus();
    }else if(event && event.keyCode === 27 && this.props.visible){
      this.onHide();
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this._handleKeyDown)
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this._handleKeyDown)
  }

  render() {
    let { children, className = '', layer = '', mode = '', theme = {}, visible, style = {} } = this.props;
    if (mode === 'menu' && !layer) {
      layer = 'transparent';
    }
    return (
      visible ? (
        <div tabIndex={"-1"} ref={container=>{this.container = container}} className={`${styles.modalLayer} ${baseStyles.overlay} ${styles[layer]} ${className}`}
             onClick={::this.onHide} onMouseOver={::this.onMouseOverLayer}>
          <div style={style} className={`${theme.modalContent} ${styles.content}`}
               onClick={Modal.cancelClick}>{children}</div>
        </div>
      ) : <span/>
    );
  }
}