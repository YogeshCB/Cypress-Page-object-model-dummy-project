import { h } from 'preact';
import Video from './media/Video';
import styles from 'stylesheets/components/commons/videocard';

export default (props) => {
  const { theme = {}, children, hoverable, onClick, ...remProps } = props;
  const videoTheme = {
    container: styles.videoContainer,
    ...theme,
  };
  return (
    <div className={`${styles.videocard} ${theme.videocard || ''}`} onClick={onClick}>
      <Video hoverable={hoverable} card={false} hoverPlay={true} theme={videoTheme} hideControls={true} {...remProps}/>
      {
        children.length > 0 ? (
          <div className={`${styles.details} ${theme.details}`}>
            {children}
          </div>
        ) : <span/>
      }
    </div>
  );
}