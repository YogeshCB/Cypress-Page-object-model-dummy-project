import { h, render } from 'preact'
import styles from 'stylesheets/profile';
import Field from '../../components/commons/Field';
import Radio from '../../components/commons/Radio';
import ImageUploader from '../../components/uploader/ImageUploader';
import Publisher from './Publisher';
import Assets from './Assets';
import baseStyles from '@bit/kubric.components.styles.commons';
import { LinkButton } from '../../components/commons/misc';

const genderOptions = [{
  label: 'Male',
  value: 'male',
}, {
  label: 'Female',
  value: 'female',
}];
const initializeSegment = () =>{
  var segmentBTn = document.getElementById('segment-button');
    if(segmentBTn) {
        segmentBTn.innerHTML = `<div class="segment-enable-button" data-redirect-url="https://app.kubric.io" data-integration="kubric" data-size="small" data-settings='{"apiKey":"cGFyb2tzaEBrdWJyaWMsaW8="}'></div>`;        
        window.segment && window.segment.EnableButton.init();
    }
}

export default ({ account = {}, formErrors = {}, pageData, saveProfile, uploadTask = {}, profilePicUpload, clearFormError, onProfileDataChanged }) => {
  const { name = '', phone_no = '', email = '', gender = '', desc, profile_image_url, profile_pic = { progressPercent : -1 } } = account;
  const { progressPercent } = profile_pic;
  const uploading = progressPercent > -1 && progressPercent < 100;
  // const { uploading, progress } = uploadTask;
  const uploaderTheme = {
    uploader: styles.uploader,
    container: styles.uploadContainer,
    progress: styles.progress
  };
  initializeSegment();
  return (
    <div className={`${styles.container} ${baseStyles.clearfix}`}>
    <div className={`${styles.flex} ${styles.nav}`}>
      <h2 className={styles.name}>Profile</h2>
      <LinkButton onClick={saveProfile} theme={styles}>Save</LinkButton>
    </div>
      <div className={styles.section}>
        <div className={styles.heading}>Personal Profile</div>
        <div className={styles.profileContainer}>
          <ImageUploader value={profile_image_url} uploading={uploading} progress={progressPercent} theme={uploaderTheme}
                         onFileSelected={profilePicUpload}/>
          <Field error={formErrors.name} label="Name" name="name" value={name} clearError={clearFormError}
                 onChange={onProfileDataChanged.bind(null, 'name')}/>
          <Field type="number" error={formErrors.phone_no} label="Phone Number" name="phone_no" value={phone_no}
                 onChange={onProfileDataChanged.bind(null, 'phone_no')} clearError={clearFormError}/>
          <Field type="email" error={formErrors.email} label="Email" name="email" value={email}
                 clearError={clearFormError} onChange={onProfileDataChanged.bind(null, 'email')}/>
          <Field error={formErrors.desc} label="Bio" name="desc" value={desc} clearError={clearFormError}
                 onChange={onProfileDataChanged.bind(null, 'desc')}/>
          <Radio options={genderOptions} name='gender' value={gender} label='Gender' theme={styles}
                 onChange={onProfileDataChanged.bind(null, 'gender')}/>
        </div>
      </div>
      <div className={styles.section}>
      <div className={styles.heading}>Ad platforms</div>
      <div className={styles.desc}>Connect your account with ad networks</div>
      <Publisher/>
      <div className={styles.heading} style={{'marginTop':'30px'}}>Customer Data Platforms</div>
      <div className={styles.desc}>Sync your Customer Data.</div>
      <br/>
      <div>API Key: <br/><span class="apiKey">{btoa(email)}</span></div>
      <div className={styles.segmentBtn} id="segment-button">
      </div>
      </div>
      <div className={styles.section}>
        <div className={styles.heading}>Asset Integrations</div>
        <div>
          <div className={styles.desc}>Connect your account with your assets</div>
          <Assets/>
        </div>
      </div>
    </div>
  );
};