import { h, Component } from "preact";
import styles from 'stylesheets/campaign/creative/editor';
import fontIcons from 'stylesheets/icons/fonticons';
import { keyCodes } from "../../../../../lib/constants";

export default class Controller extends Component {
  handleKeyup(e) {
    const { keyCode, target } = e;
    const { LEFT, RIGHT } = keyCodes;
    const body = document.querySelector("body");
    if (target === body) {
      if (keyCode === LEFT) {
        this.previous();
      } else if (keyCode === RIGHT) {
        this.next();
      }
    }
  }

  next() {
    const { nextEnabled, onNextCreative } = this.props;
    nextEnabled && onNextCreative();
  }

  previous() {
    const { previousEnabled, onPreviousCreative } = this.props;
    previousEnabled && onPreviousCreative();
  }

  componentDidMount() {
    this.keyupHandler = ::this.handleKeyup;
    document.addEventListener('keyup', this.keyupHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyupHandler);
  }

  render() {
    const { nextEnabled, previousEnabled, creativeName, countString = '' } = this.props;
    return (
      <div className={styles.controller}>
        <span
          className={`${fontIcons.fonticonLeft} ${styles.button} ${!previousEnabled ? styles.buttonDisabled : ''}`}
          onClick={::this.previous}/>
        <span className={styles.text}>
          <div className={styles.name}>{creativeName}</div>
          {countString.length > 0 ? <div className={styles.count}>{countString}</div> : <span/>}
        </span>
        <span
          className={`${fontIcons.fonticonRight} ${styles.button} ${!nextEnabled ? styles.buttonDisabled : ''}`}
          onClick={::this.next}/>
      </div>
    );
  }
}