import { h } from 'preact';
import styles from 'stylesheets/assets/uploaddialog';
import UploadTasks from '../uploadtasks';
import appIcons from 'stylesheets/icons/app';

const getStatusText = (uploaded, totalCompletedDownload, total, totalDownloadInitiated ) => {
  
  let donwloadText = '';
  let uploadText = '';

  if(uploaded === 0 && total>1){
    uploadText = `Uploading ${total} files...`;
  }
  else if(uploaded === 0 && total===1){
    uploadText = `Uploading your file...`;
  }
  else if(uploaded>0 && total>0 && uploaded<total){
    uploadText = `Uploaded ${uploaded} out of ${total}`;
  }
  else if(uploaded === total && total>0){
    uploadText = 'Upload Complete';
  }

  if(totalCompletedDownload === 0 && totalDownloadInitiated>1){
    donwloadText = `Zipping ${totalDownloadInitiated} folder...`;
  }
  else if(totalCompletedDownload === 0 && totalDownloadInitiated===1){
    donwloadText = `Zipping your folder...`;
  }
  else if(totalCompletedDownload>0 && total>0 && totalCompletedDownload<totalDownloadInitiated){
    donwloadText = `Zipped ${totalCompletedDownload} out of ${totalDownloadInitiated}`;
  }
  else if(totalCompletedDownload === totalDownloadInitiated && totalDownloadInitiated>0){
    donwloadText = 'Zipping Complete';
  }

  if(total !== uploaded && totalDownloadInitiated !== totalCompletedDownload){
    return `${uploadText} | ${donwloadText}`
  }else if(total !== uploaded && totalDownloadInitiated === totalCompletedDownload){
    return `${uploadText}`
  }else if(total === uploaded && totalDownloadInitiated !== totalCompletedDownload){
    return `${donwloadText}`
  }

  return 'Completed'
  
}

export default ({
                  uploading, failed, uploadModalStatus, uploadModal, shrink, uploaded, total, showTasksModal, showTasks, tasks, isZipping,
                  totalCompletedDownload, totalDownloadInitiated, onRetryTask
                }) => {
  return ((uploading || failed || uploadModalStatus || isZipping ) && (tasks.length > 0)  ?
      (<div
        className={`${shrink ? styles.shrink : ''} ${showTasksModal ? styles.expandedUploadDialog : ''} ${styles.uploadDialog}`}>
        <div className={styles.expanded}>
          <div onClick={showTasks} className={styles.header}>
            <span>{getStatusText(uploaded, totalCompletedDownload, total, totalDownloadInitiated )}</span>
            <span style={uploading||failed?{}:{right:'38px'}}
              className={`${styles.minimizer} ${!showTasksModal ? styles.triangleExpanded : ''} ${!showTasksModal?styles.invert:''} ${styles.triangle}`}/>
              {uploading||failed?'':<span onClick={uploadModal} className={`${appIcons.iconWhiteClose} ${styles.icon}`}></span>}
          </div>
          {showTasksModal ? <UploadTasks onRetryTask={onRetryTask} tasks={tasks}/> : ''}
        </div>
      </div>) : ''
  )
};    
   
