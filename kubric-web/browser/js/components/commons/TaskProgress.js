import { h } from 'preact';
import styles from 'stylesheets/components/commons/taskprogress';
import ProgressBar from './ProgressBar';
import fontIcons from 'stylesheets/icons/fonticons';
import appIcons from 'stylesheets/icons/app';


export default ({ data = {}, theme = {}, allowRetry, showProgress =  true, onRetryTask }) => {
  let { title, description, message, progress = 0, key, type, count, hasErred, error = '', status, result ='', fraction = '' } = data;
  description = message || description;  
  return (
    <div className={`${styles.taskprogress} ${theme.container}`}>
      <div className={styles.details}>
        <div className={styles.text}>
        <div className={styles.title}>{title}</div>
          {description ? <div className={styles.description}>{description} {progress>0?`(${progress})%`:''}</div> : <span/>}
          {type === 'ArchiveTask' && status === 1 && progress === 100? 
          <span className={`${fontIcons.fonticonDownload} ${styles.download}`} onClick={()=>window.open(result, '_blank')}>&nbsp;&nbsp;Download</span>:'' }
        </div>
        <div className={`${styles.progressValue} ${hasErred ? styles.taskErred : ''}`}>          
        {showProgress && !hasErred?<div className={styles.progressbar}>
        <div className={styles.size}>{fraction}</div>
        {progress===100?
          <span className={`${fontIcons.fonticonCheck} ${styles.iconCheck}`}></span>:<ProgressBar show={typeof progress !== 'undefined' && progress <= 100 && status !== 1}
                     progress={progress} theme={{ container: styles.bar, bar: hasErred ? styles.taskErred : '' }}/>}
      </div>:''}
      {hasErred? <div onClick={onRetryTask.bind(null, key)} className={`${styles.icon} ${appIcons.iconRetry}`}></div>:''}
          
        </div>
      </div>      
    </div>
  );
};
