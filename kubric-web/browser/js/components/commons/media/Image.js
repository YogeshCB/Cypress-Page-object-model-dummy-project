import { h } from 'preact';
import styles from 'stylesheets/components/commons/media/image';
import AttributionText from './AttributionText';
import MediaCard from './MediaCard';
import config from '../../../config';
import Draggable from '../hoc/Draggable';

const gridStylesSmall = config.assets.gridStylesSmall;
const gridURL = config.assets.gridStyles.url;

export default ({
                  image, maintainAspectRatio, filename, file_type, card = false, attribution = '', theme = {},
                  onClick, className = '', actionable, height, width, shrinkOptions, modal = false, grid, gridImage
                }) => {
  let imgTag = <span/>, imgStyle = { backgroundImage: `url("${image}")` };
  if (maintainAspectRatio) {
    imgTag = <img style={grid?{opacity:0.7, filter: 'grayscale(100%)'}:{}} src={image} className={`${styles.imageTag} ${theme?theme.image:''}`}/>;
    imgStyle = {};
  }

  const ImageElmt = ({ theme: overrideTheme = {} }) => (
    <div onClick={onClick} style={grid?gridStylesSmall:{}}
      className={`${styles.container} ${actionable ? styles.actionable : ''} ${className} ${theme.container || ''} ${overrideTheme.container || ''}`}>
      <div style={imgStyle}
           className={`${overrideTheme.image || ''} ${theme.image || ''} ${styles.image} ${card && typeof filename !== 'undefined' ? styles.fitImage : ''}`}>
        {imgTag}
        {gridImage? <img src={gridURL} className={styles.grid} />:''}
      </div>
      {attribution && attribution.length > 0 ?
        <AttributionText position="bottom right">{attribution}</AttributionText> : <span/>}
      {width && height ? width > 1000 || height > 1000 ?
        <div className={styles.hd}>HD</div> : '' : ''}
      {width && height ? <div className={styles.dimension}>{`${width}x${height}`}</div> : ''}
      <MediaCard theme={shrinkOptions ? { name: styles.nameStyle } : {}} file_type={file_type}
                 filename={filename}/>
    </div>
  );

  return modal ? (
    <Draggable theme={{ container: theme.modalContainer }}>
      <ImageElmt theme={{ container: styles.dragContainer, image: styles.dragImage }}/>
    </Draggable>
  ) : <ImageElmt/>;
}