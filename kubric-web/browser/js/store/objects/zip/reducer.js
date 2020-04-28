import { combineReducers } from 'redux';
import { zipFolder } from '../servicetypes';

const zipping = (state = false, action) => {
    switch (action.type) {
        case zipFolder.INITIATED:
            return true;        
        case zipFolder.COMPLETED:
        default:
            return state;
    }
};

const totalDownloadInitiated = (state = 0, action) => {
    switch (action.type) {
        case zipFolder.INITIATED:
            return state + 1;
        default:
            return state;
    }
};

const totalCompletedDownload = (state = 0, action) => {
    switch (action.type) {
        case zipFolder.COMPLETED:
            return state + 1;
        default:
            return state;
    }
};
export default combineReducers({
    zipping,
    totalCompletedDownload,
    totalDownloadInitiated
});
