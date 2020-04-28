import { h, Component } from 'preact';
import { isUndefined, isFunction, isNull } from "@bit/kubric.utils.common.lodash";
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import styles from 'stylesheets/components/commons/chatbox';
import { sanitizers, placeHolderRegex } from "./sanitizers";
import { getMention } from './messageline';
import theme from "../../../../../../stories/chatbox/styles.scss";
import NavigableList from "../../hoc/NavigableList";
import fontIcons from 'stylesheets/icons/fonticons';
import { keyCodes } from "../../../../lib/constants";

const parseRegex = /(.*?)(<span(?:[^<>/])*?data\-id="(.*?)".*?>(@(?:.+?))<\/span>)/g;

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.setStyler();
    this.state = {
      currentLine: 0,
    };
    this.placeHolder = this.getPlaceholder();
    this.state.message = this.placeHolder;
    if (this.placeHolder.length > 0) {
      this.placeHolderVisible = true;
    }
  }

  getPlaceholder(props) {
    props = props || this.props;
    const { placeholder = "" } = props;
    if (placeholder.length > 0) {
      return `<span data-type="placeholder" class="${styles.placeholder}">${placeholder}</span>`
    }
    return "";
  }

  static findLastTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) return node;
    let children = node.childNodes;
    for (let i = children.length - 1; i >= 0; i--) {
      let textNode = ChatBox.findLastTextNode(children[i]);
      if (textNode !== null) return textNode;
    }
    return null;
  }

  splitAtCaret({ inFocus = true, caret: targetCaret } = {}) {
    targetCaret = !isUndefined(targetCaret) ? targetCaret : this.getCaretPosition();
    const str = this.state.message;
    const text = this.inputNode.innerText;
    const splitRegex = /(?:<span.*?>(@(?:.+?))<\/span>)|(?:\&(.+?);)/g;
    let currentIndex = 0;
    const getResult = splitAt => [str.substring(0, splitAt), str.substring(splitAt), targetCaret];
    if (inFocus && (targetCaret < text.length)) {
      let currentCaret = 0;
      const matches = [...str.matchAll(splitRegex)];
      if (matches.length > 0) {
        for (let i = 0; i < matches.length; i++) {
          const { 0: match, 1: mentionMatch, 2: splMatch, index: matchIndex } = matches[i];
          let proposedCaret = currentCaret + (matchIndex - currentIndex);
          if (proposedCaret >= targetCaret) {
            return getResult(currentIndex + (targetCaret - currentCaret));
          } else {
            currentIndex = matchIndex;
            currentCaret = proposedCaret;
          }
          if (!isUndefined(splMatch)) {
            currentIndex += match.length;
            currentCaret++;
            if (targetCaret === currentCaret) {
              return getResult(currentIndex);
            }
          } else if (!isUndefined(mentionMatch)) {
            let mentionEndCaret = currentCaret + mentionMatch.length;
            if (targetCaret < mentionEndCaret) {
              const [openingTag] = match.matchAll(/<span(?:.*?)>/g);
              return getResult(currentIndex + openingTag[0].length + (targetCaret - currentCaret));
            } else if (targetCaret === mentionEndCaret) {
              return getResult(currentIndex + match.length);
            } else {
              currentCaret = mentionEndCaret;
              currentIndex += match.length;
            }
          }
        }
        //If code reaches here, it means that after all the matches, there is still plain text pending to be parsed
        return getResult(currentIndex + (targetCaret - currentCaret));
      } else {
        return getResult(targetCaret);
      }
    } else {
      return [str, '', targetCaret];
    }
  }

  static replaceEscapedHTML(str) {
    return str.replace(/\&nbsp;/g, " ");
  }

  checkIfTaggable(inFocus = true) {
    const [uptoCaret] = this.splitAtCaret({ inFocus });
    const match = ChatBox.replaceEscapedHTML(uptoCaret).match(/(?:^|\s|>)(@(?:[^\s<>]*))$/);
    return !isNull(match) && match[1];
  }

  setFocus(target) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(target, target.nodeValue ? target.nodeValue.length : 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    if (this.inputNode instanceof HTMLElement) this.inputNode.focus();
  }

  setCaretAt(childIndex, offset) {
    const el = this.inputNode;
    let childNode = el.childNodes[childIndex];
    if (!isUndefined(childNode)) {
      if (childNode.nodeType !== Node.TEXT_NODE) {
        childNode = childNode.childNodes[0];
      }
      if (childNode) {
        const range = document.createRange();
        const sel = window.getSelection();
        offset = offset <= childNode.nodeValue.length ? offset : childNode.nodeValue.length;
        range.setStart(childNode, offset);
        range.setEnd(childNode, offset);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  getRelativeCaretPosition(str, caretPos) {
    str = ChatBox.replaceEscapedHTML(str);
    const matches = [...str.matchAll(parseRegex)];
    if (matches.length === 0) {
      //eg. "abcde"
      return {
        childIndex: 0,
        offset: caretPos
      }
    } else {
      let childIndex = -1, matchEndIndex = 0, lastTagLength;
      matches.forEach(({ 0: match, 1: text = "", 4: tagText, index: matchIndex }, index) => {
        //If text.length > 0, there is a text node in the match. So increment child node index
        //eg. abcd<span..>@Jophin</span>
        text.length > 0 && childIndex++;
        //If there is a match, there is a mention. So increment childNode index again to account for this
        childIndex++;
        if (index === (matches.length - 1)) {
          matchEndIndex = matchIndex + match.length;
          lastTagLength = tagText.length;
        }
      });
      const endString = str.substring(matchEndIndex);
      if (endString.length > 0) {
        const spanRegex = /<span.*?>/;
        if (spanRegex.test(endString)) {
          //This means that the string ends without completing and opened mention
          //eg. abcd<span..>@Jophin</span> defg<span..>@Ris
          const [beforeSpan, afterSpan] = endString.split(spanRegex);
          beforeSpan.length > 0 && childIndex++;
          return {
            childIndex: childIndex + 1,
            offset: afterSpan.length
          }
        } else {
          //This means that the str ends with some text after the last mention
          //eg. abcd<span..>@Jophin</span> defg
          return {
            childIndex: childIndex + 1,
            offset: endString.length
          }
        }
      } else {
        //str ends at the exact end of a mention
        //eg. abcd<span..>@Jophin</span> defg<span..>@Rishi</span>
        return {
          childIndex,
          offset: lastTagLength
        }
      }
    }
  }

  setCaret() {
    const el = this.inputNode;
    // Place the caret at the end of the element
    const target = ChatBox.findLastTextNode(el);
    // do not move caret if element was not focused
    const isTargetFocused = document.activeElement === el;
    if (this.placeHolderVisible && isTargetFocused) {
      this.setCaretAt(0, 0);
    } else if (!isUndefined(this.setCaretTo)) {
      const [str] = this.splitAtCaret({ caret: this.setCaretTo });
      const { childIndex, offset } = this.getRelativeCaretPosition(str, this.setCaretTo);
      this.setCaretAt(childIndex, offset);
      this.setCaretTo = undefined;
    } else if (this.newLineAdded) {
      this.newLineAdded = false;
      const childNodes = this.inputNode.childNodes;
      this.setFocus(childNodes[childNodes.length - 1]);
    } else if (target !== null && target.nodeValue !== null && isTargetFocused) {
      this.setFocus(target);
    }
  }

  sanitize(html) {
    const sanitizerData = {
      expectedPlaceholder: this.props.placeholder
    };
    return sanitizers.reduce((acc, sanitizer) => sanitizer(acc, sanitizerData), html);
  }

  onListSelected(entry, clicked = false) {
    const { label: name, id } = entry;
    const tag = getMention({
      value: {
        type: "user",
        name,
        id
      },
      styler: this.styler
    });
    const [split1, split2, currentCaret = 0] = this.splitAtCaret({
      inFocus: true,
      caret: clicked ? this.setCaretTo : undefined
    });
    const newSplit1 = `${split1.replace(/@([^@]*?)$/, "")}${tag}`;
    this.setCaretTo = currentCaret + name.length + 1;
    this.setMessage(`${newSplit1}${split2}`);
  }

  static getTextObject(text) {
    return {
      type: "text",
      value: text
    };
  }

  static replacePlaceholder(str) {
    return str.replace(placeHolderRegex, "");
  }

  parseHTML() {
    const message = ChatBox.replacePlaceholder(ChatBox.replaceEscapedHTML(this.state.message))
      .replace(/^\s+|\s+$/g, "");
    const matches = [...message.matchAll(parseRegex)];
    let matchEndIndex = 0;
    const parsedLine = matches.reduce((acc, { 0: match, 1: text = "", 2: tagHtml, 3: tagId, 4: tagText, index: matchIndex }, index) => {
      if (text.length > 0) {
        acc.push(ChatBox.getTextObject(text));
      }
      acc.push({
        type: "mention",
        value: {
          type: "user",
          text: tagText,
          id: tagId,
        }
      });
      if (index === (matches.length - 1)) {
        matchEndIndex = matchIndex + match.length;
      }
      return acc;
    }, []);
    if (matchEndIndex <= (message.length - 1)) {
      const endString = message.substring(matchEndIndex);
      if (endString.length > 0) {
        parsedLine.push(ChatBox.getTextObject(endString));
      }
    }

    return parsedLine.length === 0 ? false : [parsedLine];
  }

  onSend() {
    const { onSend } = this.props;
    const message = this.parseHTML();
    message && isFunction(onSend) && setImmediate(onSend, {
      parts: message,
      text: this.inputNode.innerText
    });
    this.setMessage();
  }

  onKeyDown(e) {
    const { onKeyDown, listOpen } = this.props;
    const keyCode = e.keyCode;
    if (
      keyCode === keyCodes.ENTER || (listOpen && (keyCode === keyCodes.UP || keyCode === keyCodes.DOWN)) ||
      (keyCode === keyCodes.RIGHT && this.placeHolderVisible)
    ) {
      e.stopPropagation();
      e.preventDefault();
    }
    keyCode === keyCodes.ENTER && !listOpen && this.onSend();
    onKeyDown(e);
  }

  getCaretPosition() {
    const element = this.inputNode;
    let caretOffset = 0;
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type !== "Control") {
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  reconcile(message) {
    if (this.placeHolderVisible && !placeHolderRegex.test(message)) {
      this.placeHolderVisible = false;
    }
    return message;
  }

  setMessage(message = "") {
    let sanitized = this.sanitize(message);
    sanitized = this.reconcile(sanitized);
    if (sanitized !== message) {
      this.setCaretTo = this.getCaretPosition();
    }
    this.setState({
      message: sanitized
    });
  }

  onKeyUp(e) {
    const { onKeyUp } = this.props;
    const { listOpen, onOpenList, onCloseList, onQueryChange } = this.props;
    this.setMessage(this.inputNode.innerHTML);
    const keyCode = e.keyCode;
    const isTaggable = this.checkIfTaggable();
    const query = (isTaggable || '').replace(/^@/, "");
    if (listOpen && ((keyCode === keyCodes.BACKSPACE && !isTaggable) || keyCode === keyCodes.SPACE)) {
      onCloseList();
    } else if ((keyCode === keyCodes.AT || keyCode === keyCodes.BACKSPACE) && isTaggable) {
      onOpenList(query);
    } else if (listOpen) {
      onQueryChange(query);
    }
    if (keyCode === keyCodes.BACKSPACE) {
      this.setCaretTo = this.getCaretPosition();
    }
    isFunction(onKeyUp) && onKeyUp(e);
  }

  onFocus() {
    setImmediate(() => this.placeHolderVisible && this.setMessage(ChatBox.replacePlaceholder(this.state.message)));
  }

  setStyler(theme) {
    theme = theme || this.props.theme;
    this.styler = new StyleExtractor(styles, theme);
  }

  componentWillReceiveProps(nextProps) {
    const { theme } = nextProps;
    !isUndefined(theme) && this.setStyler();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.inputNode || this.inputNode.innerHTML !== nextState.message;
  }

  componentDidUpdate() {
    if (this.inputNode.innerHTML !== this.state.message) {
      this.setMessage(this.state.message);
    }
    this.setCaret();
  }

  onBlur() {
    const { listOpen, onBlur } = this.props;
    if (listOpen) {
      this.setCaretTo = this.getCaretPosition();
    }
    if (this.state.message.length === 0) {
      this.placeHolderVisible = true;
      this.setMessage(this.placeHolder);
    }
    onBlur();
  }

  onInput() {
    this.setMessage(this.inputNode.innerHTML);
  }

  render() {
    return (
      <div className={this.styler.get("container")}>
        <div contentEditable={true} ref={node => this.inputNode = node} dangerouslySetInnerHTML={{
          __html: this.state.message
        }} className={styles.input} onKeyUp={::this.onKeyUp} onKeyDown={::this.onKeyDown} onBlur={::this.onBlur}
             onFocus={::this.onFocus} onMouseDown={::this.onFocus} onInput={::this.onInput}/>
        <div className={`${styles.send} ${fontIcons.fonticonSend}`} onClick={::this.onSend}/>
      </div>
    )
  }
}

export default ({ tagUsers, ...props }) => (
  <NavigableList {...props} listPosition="top" source={tagUsers} InputComponent={ChatBox}/>)