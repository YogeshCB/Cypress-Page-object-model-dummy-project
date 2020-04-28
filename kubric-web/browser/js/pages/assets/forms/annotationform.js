import { h } from 'preact';
import { PrimaryButton } from "../../../components/commons/misc";
import styles from 'stylesheets/assets/form';
import { SearchBox } from "../../../components";

export default ({ onUpload, onTagAdded, onTagDeleted, tags }) => (
  <span>
    <div className={styles.editForm}>
      <div className={styles.fields}>
        <SearchBox label="Tags" value={tags} freeEntry={true} showSelected={true} onSelected={onTagAdded}
                   onDeleted={onTagDeleted} theme={{ tag: styles.activeTag }}/>
      </div>
    </div>
    <div className={styles.actions}>
      <PrimaryButton onClick={onUpload.bind(null, undefined)}>Upload</PrimaryButton>
    </div>
  </span>
);