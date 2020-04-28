import { h } from 'preact';
import { PrimaryButton } from "../../components/commons/misc";
import { connect } from 'preact-redux';
import campaignOperations from "../../store/objects/campaign/operations";
import ssOperations from "../../store/objects/campaign/ssupload/operations";
import campaignSelectors from '../../store/objects/campaign/selectors';
import creativesListPack from '../../store/objects/campaign/creatives/list';
import creativeOperations from '../../store/objects/campaign/creatives/operations';
import ConfirmationDialog from '../../components/commons/ConfirmationDialog';
import baseStyles from '@bit/kubric.components.styles.commons';

const Button = ({
                  pageNumber, onMultipleAdRetry, isCreative, generateCreative, onGenerateConfirmation, onCancelConfirmation,
                  confirmationDialog, missingAssetsCount, totalVideos, onOpenUpload
                }) => {
  let onClickHandler, buttonName = "Next";
  if (pageNumber === 0) {
    onClickHandler = onOpenUpload;
    buttonName = "Customize";
  } else if (pageNumber === 2) {
    onClickHandler = onGenerateConfirmation;
    buttonName = "Generate";
  } else if (isCreative) {
    onClickHandler = generateCreative;
    buttonName = "Generate";
  }
  const total = totalVideos.length;

  return (
    <span>
    <ConfirmationDialog visible={confirmationDialog} onConfirm={onMultipleAdRetry} onCancel={onCancelConfirmation}
                        heading={'Do you want to continue?'}>
      {total === 0 ? 'All' : total} video{`${total === 1 ? '' : 's'}`} will be generated.
      {missingAssetsCount > 0 ? `${missingAssetsCount} video${missingAssetsCount === 1 ? '' : 's'} will not be generated because of missing assets.` : ''}
    </ConfirmationDialog>
    <PrimaryButton onClick={onClickHandler} className={pageNumber === 1 ? baseStyles.hide : ''}>
      {buttonName}
    </PrimaryButton>
  </span>
  );
};

export default connect(() => ({
  pageNumber: campaignSelectors.getCurrentPage(),
  confirmationDialog: campaignSelectors.getConfirmationDialog(),
  totalVideos: creativesListPack.selectors.getSelectedIds(),
  missingAssetsCount: campaignSelectors.getAdsWithMissingAssets(),
}), {
  ...campaignOperations,
  ...creativeOperations,
  ...ssOperations,
})(Button);