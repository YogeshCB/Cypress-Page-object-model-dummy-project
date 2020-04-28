import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/chatter';
import { StyleExtractor } from "@bit/kubric.components.styles.utils";
import { isNull } from "@bit/kubric.utils.common.lodash";
import Scrollable from "../hoc/Scrollable";
import { Spinner } from "../../index";
import Message from './message';
import ChatBox from './ChatBox';

const DateBucket = ({ date }) => (
  <div className={styles.datebucket}>
    <div className={styles.separator}/>
    <div className={styles.date}>{date}</div>
  </div>
);

const messageMap = {
  "message": Message,
  "datebucket": DateBucket
};

export default class Chatter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setScroll() {
    if (!isNull(this.chatter) && !isNull(this.scroller) && !isNull(this.messages)) {
      const { messages = [] } = this.props;
      const { noScroll } = this.state;
      const newNoScroll = (this.messages.offsetHeight + 60) <= this.chatter.offsetHeight;
      messages.length > 0 && noScroll !== newNoScroll && this.setState({
        noScroll: newNoScroll
      });
      setImmediate(() => this.scroller.scrollTop = this.scroller.scrollHeight);
    }
  }

  componentDidUpdate(previousProps) {
    const { messages: prevMessages = [] } = previousProps;
    const { messages: currentMessages = [] } = this.props;
    prevMessages.length !== currentMessages.length && setImmediate(::this.setScroll);
  }

  componentDidMount() {
    setImmediate(::this.setScroll);
  }

  componentWillReceiveProps(nextProps, nextContext) {

  }

  onSend(message) {
    const { onSendMessage, data = {} } = this.props;
    onSendMessage({
      message,
      data
    });
  }

  render() {
    const { messages = [], currentUser, theme = {}, isConnected = false, loading = false, onLoadNext, messagesLoading = false, loadingCompleted, placeholder = "", tagUsers } = this.props;
    let messageOwner;
    const styler = new StyleExtractor(styles, theme);
    const { noScroll } = this.state;
    return (
      <div className={styler.get('chatter')} ref={node => this.chatter = node}>
        <div className={styles.messagesContainer}>
          <Scrollable theme={{ scroller: `${styles.scroller} ${noScroll ? styles.noScroll : ''}` }}
                      direction="up" onLoadNext={onLoadNext} loading={messagesLoading}
                      getRef={node => this.scroller = node} completed={loadingCompleted}>
            <div className={styles.spinnerContainer}>
              {loading ? <Spinner noOverlay={true} theme={{ spinner: styles.previousSpinner }}/> : <span/>}
            </div>
            <div ref={node => this.messages = node}>
              {messages.map(({ type, payload = {}, sent }) => {
                const { user = {} } = payload;
                const { email } = user;
                const isCurrentUser = email === currentUser;
                const showUser = !isCurrentUser && email !== messageOwner;
                messageOwner = email;
                const Elmt = messageMap[type];
                return <Elmt {...payload} sent={sent} showUser={showUser} align={isCurrentUser ? 'right' : 'left'}/>;
              })}
            </div>
          </Scrollable>
        </div>
        <div className={styles.inputs}>
          <div className={styles.textEntry}>
            <ChatBox placeholder={placeholder} theme={styles} onSend={::this.onSend} tagUsers={tagUsers}/>
          </div>
        </div>
        {!isConnected ? <Spinner theme={styles}/> : <span/>}
      </div>
    );
  }
}