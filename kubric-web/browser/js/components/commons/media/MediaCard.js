import { h } from 'preact';
import styles from 'stylesheets/components/commons/media/card';

const getExt = filename => {
  return filename.substr(filename.lastIndexOf('.') + 1);
};

export default ({ filename, mediaData, file_type, onClick, theme = {} }) => {
  return typeof filename !== 'undefined' && filename.length > 0 ? (
    <div onClick={onClick} className={`${styles.container} ${theme.card}`}>
      <div>
        <span
          className={`${theme ? theme.name : ''} ${styles.name}`}>{filename.lastIndexOf('.')>-1?filename.substring(0, filename.lastIndexOf('.')):filename}</span>
          {file_type && <span className={`${theme ? theme.name : ''} ${styles.name} ${styles.extension}`}>{file_type.substr(0)}</span>}
      </div>
    </div>
  ) : null;
};
