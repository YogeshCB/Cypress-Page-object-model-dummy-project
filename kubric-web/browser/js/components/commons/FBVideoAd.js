import { h } from 'preact';
import Video from './media/Video';
import Image from './media/Image';
import fontIcons from 'stylesheets/icons/fonticons';
import styles from 'stylesheets/components/commons/fbvideoad';

const Icon = ({ className, children }) => (
  <div className={styles.iconContainer}>
    <div className={`${className} ${styles.icon}`}/>
    <div className={styles.iconName}>{children}</div>
  </div>
);

export default ({ thumbnail, page, text, headline, description, video, theme = {}, cta, height, width }) => {
  const showVideoDetails = headline || description || cta;
  return (
    <div className={`${theme.container || ''} ${styles.container}`}>
      <div className={styles.header}>
        <Image image={thumbnail} theme={{ container: styles.image }}/>
        <div className={styles.headerDetails}>
          <div className={styles.page}>{page}</div>
          <div className={styles.sponsored}>Sponsored</div>
        </div>
      </div>
      {text ? <div className={styles.text}>{text}</div> : <span/>}
      <div className={`${!showVideoDetails ? '' : styles.hasDetails} ${styles.videoContainer}`}>
        <Video hoverable={false} card={false} theme={{ container: theme.videoContainer }} media={video} muted={false} hoverPlay={true}
               hideAll={true} height={height} width={width}/>
        {showVideoDetails ? (
          <div className={styles.footer}>
            {headline ? <div className={styles.headline}>{headline}</div> : <span/>}
            {description ? <div className={styles.description}>{description}</div> : <span/>}
            <div className={styles.buttonContainer}>
              <button className={styles.learnMore}>{cta}</button>
            </div>
          </div>
        ) : <span/>}
      </div>
      <div className={styles.icons}>
        <Icon className={fontIcons.fonticonLike}>Like</Icon>
        <Icon className={fontIcons.fonticonComment}>Comment</Icon>
        <Icon className={fontIcons.fonticonShare}>Share</Icon>
      </div>
    </div>
  );
}