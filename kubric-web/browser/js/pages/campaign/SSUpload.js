import { connect } from "preact-redux";
import SSUpload from './ssupload/index';
import ssOperations from '../../store/objects/campaign/ssupload/operations';
import ssSelectors from "../../store/objects/campaign/ssupload/selectors";
import services from "../../services";
import routeSelectors from "../../store/objects/route/selectors";
import { CAMPAIGN_SB_ROUTE, CREATED_CAMPAIGN_ROUTE } from "../../routes";
import campaignSelectors from "../../store/objects/campaign/selectors";
import { getSelectedStoryboards } from "../../store/objects/campaign/ssupload/utils";

export default connect(state => {
  const routeId = routeSelectors.getRouteId(state);
  const { progress: csvProgress = 0, message: progressMessage = "", hasErred } = ssSelectors.getCSVProgress(state);
  let csvLink = "";
  const getSBLink = ({ id: storyboard, version }) => services
    .campaign
    .downloadCSVTemplate()
    .getUrl({
      storyboard,
      version
    });
  if (routeId === CAMPAIGN_SB_ROUTE) {
    const [sbData] = getSelectedStoryboards();
    if (sbData) {
      csvLink = getSBLink(sbData);
    }
  } else if (routeId === CREATED_CAMPAIGN_ROUTE) {
    const templateId = campaignSelectors.getTemplateId();
    if (templateId.length > 0) {
      csvLink = services
        .template
        .downloadCSVTemplate()
        .getUrl({
          templateId
        });
    } else {
      const [sbData] = campaignSelectors.getLinkedStoryboards(state);
      csvLink = getSBLink(sbData);
    }
  }
  return ({
    visible: ssSelectors.isModalOpen(state),
    uploading: ssSelectors.isCSVUploading(state),
    csvProgress,
    progressMessage,
    hasErred,
    uploadCompleted: ssSelectors.isCSVUploadCompleted(state),
    csvLink,
  })
}, {
  ...ssOperations
})(SSUpload);