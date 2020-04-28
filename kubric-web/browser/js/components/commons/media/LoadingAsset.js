import { h } from 'preact';
import styles from 'stylesheets/components/commons/media/loading';
import ProgressBar from '../ProgressBar';
import appIcons from 'stylesheets/icons/app';

export default ({ data, onClick }) => {
  const { name, title, onRetryUpload, message = "Uploading", file, key, progress = 0, hasErred } = data;
  return (
    <div onClick={onClick} className={`${styles.container}`}>
      {hasErred? <div className={styles.refresh} onClick={onRetryUpload.bind(null, key, { files: [file] })} >
          <span className={`${appIcons.iconRetry} ${styles.iconRetry}`}></span>
          <h3>RETRY</h3>
        </div>:
      [<div className={`${appIcons.iconMediaLoading} ${styles.icon}`}/>,
      <ProgressBar theme={{container:styles.containerProgress, bar:styles.bar}} show={true} progress={progress}/>]}
      <h3 className={styles.title}>{name || title}</h3>
      <span className={styles.message}>{message}</span>
    </div>
  );
};