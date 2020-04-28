import { h } from 'preact';
import AnnotationForm from './forms/annotationform';
import styles from 'stylesheets/assets/fileview';

const MAX_SIZE = 5000000;

export default props => {
  const { files = [] } = props;
  const numFiles = files.length;
  const showThumbnails = numFiles < 30;
  const showCount = numFiles > 150;
  return (
    <div>
      <h3>Editing {files.length} asset{files.length > 0 ? 's' : ''}</h3>
      <div className={styles.row}>
        <div className={styles.fileContainer}>
          {showCount ? (
            <div>Uploading {numFiles} files</div>
          ) : (
            <div>
              {files.map(file => (
                <div className={styles.file}>
                  {showThumbnails ? (
                    <div className={styles.thumbnail}>
                      {(file.size < MAX_SIZE && file.type.indexOf('video') > -1) ?
                        <video className={styles.fileThumbnail} src={window.URL.createObjectURL(file)}/> : ''}
                      {(file.size < MAX_SIZE && file.type.indexOf('image') > -1) ?
                        <img className={styles.fileThumbnail} src={window.URL.createObjectURL(file)}/> : <span/>}
                    </div>
                  ) : <span/>}
                  <div className={styles.name}>{file.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.formedit}>
          <AnnotationForm {...props} />
        </div>
      </div>
    </div>
  );
}