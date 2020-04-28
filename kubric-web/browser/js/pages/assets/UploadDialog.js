import UploadDialog from './uploaddialog/index';
import assetUploadPack from '../../store/objects/assets/fileuploads';
import zipSelectors from '../../store/objects/zip/selectors';
import { constants } from '../../store/objects/uploads_new';
import assetActions from '../../store/objects/assets/actions';
import { connect } from 'preact-redux';
import assettasksSelectors from '../../store/objects/assettasks/selectors';
import assetsOperations from '../../store/objects/assets/operations/index';

const uploadPackConnectedCopmponent = assetUploadPack.connect(
    {
        uploading: constants.PROGRESS_COUNT,
        failed: constants.FAILED_COUNT,
        uploaded: constants.SUCCESS_COUNT,
        total: constants.TOTAL_COUNT,
    },
    {
        mapDispatchToProps: {
            ...assetActions
        }
    }
)(UploadDialog);

export default connect(
    state => {
        return {
            isZipping: zipSelectors.getIsZipping(),
            totalDownloadInitiated: zipSelectors.getTotalDownloadInitiated(),
            totalCompletedDownload: zipSelectors.getTotalCompletedDownload(),
            tasks: assettasksSelectors.getAssetTasksData(),
        };
    },
    {
        ...assetsOperations
    }
)(uploadPackConnectedCopmponent);
