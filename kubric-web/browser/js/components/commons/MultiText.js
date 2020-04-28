import { h, Component } from 'preact';

class MultiText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finalText: this.props.children
    };
  }

  createDummy() {

    const dummy = this.dummy = document.createElement('div');
    dummy.style.position = 'absolute';
    dummy.style.visibility = 'hidden';
    dummy.style.width = this.node.offsetWidth + 'px';
    const computedStyles = getComputedStyle(this.node.parentNode);
    dummy.style.fontFamily = computedStyles.fontFamily;
    dummy.style.fontSize = computedStyles.fontSize;
    dummy.style.fontWeight = computedStyles.fontWeight;
    dummy.style.lineHeight = computedStyles.lineHeight;
    const body = this.body = document.getElementsByTagName('body')[0];
    body.appendChild(dummy);
    return dummy;
  }

  removeDummy() {
    this.body.removeChild(this.dummy);
  }

  componentWillReceiveProps(props) {
    props.children !== this.props.children && this.parseText(props);
  }

  componentDidMount() {
    this.parseText();
  }

  parseText(props) {
    props = props || this.props;
    const { delay = 0 } = props;
    setTimeout(() => {
      if (this.node !== null) {
        this.createDummy();
        let resultText = '';
        let regex = /(.*?)((?:\s+)|$)/g;
        let matchArr;
        let previousIndex;
        let innerText = '';
        let targetHeight = this.node.offsetHeight;
        let { children = '' } = props;
        const [targetText] = children;
        do {
          previousIndex = regex.lastIndex;
          matchArr = regex.exec(targetText);
          innerText += matchArr[0];
          matchArr[0] !== '' && (this.dummy.innerText = innerText + '...');
        } while (this.dummy.offsetHeight <= targetHeight && matchArr[0] !== '');
        if (matchArr[0] === '') {
          resultText = targetText;
        } else {
          resultText = targetText.slice(0, previousIndex) + '...';
        }
        this.setState({
          finalText: resultText,
        });
        this.removeDummy();
      }
    }, delay);
  }

  render() {
    return (
      <div className={this.props.className} ref={node => this.node = node}>
        {this.state.finalText}
      </div>
    );
  }
}

export default MultiText;
