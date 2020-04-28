import { h, Component } from 'preact';
import styles from 'stylesheets/mixins/infinitescroller';
import { Spinner } from "../..";
import { isFunction } from "@bit/kubric.utils.common.lodash";

export default class Scrollable extends Component {
  constructor(props) {
    super(props);
    this.previousScrollHeight = -1;
  }

  onScroll() {
    const {
      loading, completed, direction = "down"
    } = this.props;
    if (loading || completed) {
      return false;
    } else {
      if (!this.ticking) {
        this.ticking = true;
        requestAnimationFrame(() => {
          const { scrollHeight, offsetHeight, scrollTop } = this.scrollWindow;
          const { onLoadNext } = this.props;
          const { previousScrollHeight, lastScrollTop } = this;
          this.ticking = false;
          //The 50 buffer is kept to resolve the issue in windows. Without that, infinite scroll will not be
          //detected in windows browsers.
          if ((
            (direction === "down" && ((scrollTop + offsetHeight) >= (scrollHeight - 50))) ||
            (direction === "up" && (lastScrollTop && scrollTop < this.lastScrollTop) && scrollTop <= 30)
          ) && (scrollHeight > previousScrollHeight)) {
            this.previousScrollHeight = scrollHeight;
            onLoadNext && onLoadNext();
          }
          this.lastScrollTop = scrollTop;
        });
      }
    }
  }

  render() {
    const {
      loading = false, HeaderComponent, noOverlay = false, completed = false, children, getRef,
      loadingComponent = <Spinner noOverlay={noOverlay}
                                  theme={{ spinner: styles.spinner, container: styles.spinnerOverlay }}/>
    } = this.props;
    const { noScroll } = this.state;
    const showLoading = !completed && loading;
    const { theme = {}, direction = "down", style = {} } = this.props;
    const spinner = (
      <div className={styles.spinnerContainer}>
        {loadingComponent}
      </div>
    );
    return (
      <div className={`${styles.infiniteScroller} ${noScroll ? styles.noScroll : ''} ${theme.scroller}`}
           onScroll={::this.onScroll}
           ref={node => {
             isFunction(getRef) && getRef(node);
             this.scrollWindow = node;
           }} style={style}>
        <div>
          {(direction === "up" && showLoading) ? spinner : <span/>}
          {HeaderComponent ? <HeaderComponent/> : <span/>}
          {children}
          {(direction === "down" && showLoading) ? spinner : <span/>}
        </div>
      </div>
    );
  }
};