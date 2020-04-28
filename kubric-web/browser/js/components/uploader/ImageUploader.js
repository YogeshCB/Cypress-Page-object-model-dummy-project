import { h, Component } from 'preact';
import styles from 'stylesheets/components/imageuploader';
import baseStyles from '@bit/kubric.components.styles.commons';
import mixinUploader from '../../mixins/uploader';
import ProgressBar from '../commons/ProgressBar';

const getContent = value => value ? (
  <div style={{ backgroundImage: `url('${value}')` }}
       className={`${styles.image} ${baseStyles.bgCenterCrop}`}/>
) : (
  <div>Upload Image</div>
);

const ImageUploader = ({ value, uploading, showProgress = true, progress, openFileSelection, theme = {} }) => {
  return (
    <div
      className={`${theme.uploader || ''} ${styles.imageUploader} ${((value && !uploading) ? styles.hoverAppear : '')}`}>
      { !uploading && getContent(value)}
      <ProgressBar show={showProgress && uploading} progress={progress} className={`${theme.progress || ''} ${styles.progress}`}/>
    </div>
  );
};

export default mixinUploader(ImageUploader, {
  accept: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*',
  readImage: true,
});