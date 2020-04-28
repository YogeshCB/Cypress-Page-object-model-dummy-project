import { h } from 'preact';
import Modal from '../../../components/commons/Modal';
import mixinUploader from '../../../mixins/uploader';
import styles from 'stylesheets/campaign/storyboards/uploader';
import ProgressBar from '../../../components/commons/ProgressBar';
import { getFileAcceptTypes } from "../../../lib/utils";

const Uploader = mixinUploader(() => (<div className={styles.uploader}>+ Drop Customization CSV</div>), {
  dropzone: true,
  accept: getFileAcceptTypes('audience'),
  theme: styles
});

const Progress = ({ progress, message }) => (
  <div className={styles.progressContainer}>
    <div className={styles.title}>{message}</div>
    <ProgressBar progress={progress} className={styles.progress} theme={{ ...styles, container: styles.barContainer }}
                 visible={true}/>
    <div className={styles.percent}>{progress}% completed</div>
  </div>
);

export default ({
                  visible, uploading, csvProgress, onCSVFileSelected, progressMessage = 'Processing uploaded CSV', onCloseUpload,
                  hasErred = false, csvLink
                }) => {
  const isIdle = (!uploading && csvProgress === 0);
  return (
    <Modal theme={styles} visible={visible} onHide={() => (isIdle || hasErred) && onCloseUpload()}>
      <div className={styles.heading}>Customization</div>
      <a href="javascript:void(0);" onClick={e => window.open(csvLink, "_blank")} className={styles.link} download>Download
        CSV Template</a>
      {
        hasErred ?
          <div className={styles.err}>Error occurred while processing uploaded CSV. Please contact Kubric team.</div>
          : (isIdle ? <Uploader onDropped={onCSVFileSelected} theme={{ container: styles.uploadContainer }}
                                onFileSelected={onCSVFileSelected}/> :
          <Progress progress={csvProgress} message={progressMessage}/>)
      }
    </Modal>
  );
}