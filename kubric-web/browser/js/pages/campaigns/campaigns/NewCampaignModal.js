import { h } from 'preact';
import ConfirmationDialog from '../../../components/commons/ConfirmationDialog';
import Field from '../../../components/commons/Field';
import { connect } from 'preact-redux';
import newCampaignOperations from "../../../store/objects/campaign/operations";
import newCampaignSelectors from "../../../store/objects/campaign/selectors";
import styles from "stylesheets/campaigns/newcampaignmodal";
import Radio from "../../../components/commons/Radio";
import { PrimaryButton } from '../../../components/commons/misc';

const component = ({ visible, campaignName, mediaFormat, onNameChanged, onTypeChanged, onCampaignConfirm, onHideModal }) => (
  <ConfirmationDialog visible={visible} onCancel={onHideModal} onConfirm={onCampaignConfirm} hideCancel={true}
                      confirmBtn={<PrimaryButton onClick={onCampaignConfirm}>Create</PrimaryButton>} theme={styles}>
    <div className={styles.left}>
      <h2>Give a name to your campaign, make it distinct.</h2>
      <div className={styles.fields}>
        <Field theme={styles} onChange={onNameChanged} label="New campaign name" value={campaignName}/>
        <Radio label="Creative Type" options={[{
          value: "video",
          label: "Video"
        }, {
          value: "image",
          label: "Collage"
        }]} onChange={onTypeChanged} value={mediaFormat}/>
      </div>
    </div>
    <img className={styles.engine}
         src="https://res.cloudinary.com/dsvdhggfk/image/upload/c_scale,w_400/kubric-machine-01_nkfpoo.png"/>
  </ConfirmationDialog>
);

export default connect(state => ({
  campaignName: newCampaignSelectors.getCampaignName(),
  visible: newCampaignSelectors.isNameModalOpen(),
  mediaFormat: newCampaignSelectors.getMediaFormat()
}), {
  ...newCampaignOperations
})(component);