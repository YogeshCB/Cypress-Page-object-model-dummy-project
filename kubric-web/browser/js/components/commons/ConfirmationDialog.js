import { h } from 'preact';
import Modal from './Modal';
import styles from 'stylesheets/components/commons/confirmationdialog';
import { PrimaryButton, SecondaryButton } from "./misc";

export default ({ theme = {}, visible, hideCancel = false, onCancel, onConfirm, heading = '', children, cancelBtn = 'Cancel', confirmBtn }) => (
  <Modal visible={visible} onHide={onCancel} theme={{ ...styles, ...theme }}>
    <div className={`${styles.container} ${theme.container}`}>
      {heading.length > 0 ? <div className={styles.heading}>{heading}</div> : <span/>}
      <div className={`${theme.content} ${styles.content}`}>{children}</div>
      <div className={`${theme.actions} ${styles.actions}`}>
        {!hideCancel ? <SecondaryButton onClick={onCancel}>{cancelBtn}</SecondaryButton> : <span/>}&nbsp;&nbsp;
        {confirmBtn ? confirmBtn:<PrimaryButton className={styles.button} onClick={onConfirm}>Confirm</PrimaryButton>}
      </div>
    </div>
  </Modal>
);