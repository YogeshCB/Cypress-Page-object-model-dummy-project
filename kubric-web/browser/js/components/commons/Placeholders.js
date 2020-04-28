import { h } from 'preact';
import styles from 'stylesheets/components/commons/placeholders/index';
import appIcons from 'stylesheets/icons/app';
import campaignCardStyles from 'stylesheets/components/commons/placeholders/campaigncard';

export const ImagePlaceHolder = ({ className = '' }) =>
  <div className={`${styles.image} ${appIcons.iconImagePlaceholder} ${className}`}/>;

export const SceneCarouselPlaceholder = ({ count = 3, theme = {} }) =>
  <div className={`${styles.carouselContainer} ${theme.carouselContainer}`}>
    {Array(count).fill(count).map(() => <ImagePlaceHolder/>)}
  </div>
;

export const FramePlaceholder = ({ theme = {} }) =>
  <div className={`${styles.frameContainer} ${theme.container}`}>
    <div className={`${styles.frame} ${appIcons.iconFrame}`}/>
  </div>;

export const CampaignCardPlaceholder = ({ theme = {} }) => <div
  className={`${theme.card} ${campaignCardStyles.card}`}/>;