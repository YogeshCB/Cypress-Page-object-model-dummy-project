import SocketFileUpload from 'socketio-file-upload';
import { campaignEvents, connections, errorEvents } from "../../../isomorphic/sockets";
import getUploadTypes from "../store/objects/uploads_new/types";
import getActions from "../store/objects/uploads_new/actions";
import store from '../store';
import { getFileKey } from "../lib/utils";
import RTConnection from "../lib/rtconnection";
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import ssActions from "../store/objects/campaign/ssupload/actions";
import { listenToSpreadsheetJob } from "../store/objects/campaign/listeners";

const ssUploadActions = getActions(getUploadTypes('creatives-csv'));

export default class SSUploader {
  static uploader;

  async init() {
    const connection = this.connection = RTConnection.getInstance(connections.CAMPAIGN);
    await connection.connect();
    this.socketUploader = new SocketFileUpload(connection.getSocket());
    const socket = connection.getSocket();

    socket.on(campaignEvents.CSV_UPLOAD_PROGRESSED, ({ progressPercent = 0 }) => {
      store.dispatch(ssUploadActions.progressed({
        key: this.currentFileKey,
        progressPercent
      }));
      store.dispatch(ssActions.adCreationProgressed({
        progress: parseInt(progressPercent / 10),
        message: "Uploading CSV"
      }));
    });

    socket.on(campaignEvents.CSV_UPLOAD_ERRED, () => {
      store.dispatch(ssUploadActions.failed({
        key: this.currentFileKey
      }));
      store.dispatch(ssActions.adCreationProgressed({
        progress: 0,
        hasErred: true
      }));
    });

    socket.on(campaignEvents.CSV_UPLOAD_COMPLETED, () => {
      store.dispatch(ssUploadActions.completed({
        key: this.currentFileKey
      }));
      store.dispatch(ssActions.adCreationProgressed({
        progress: parseInt(10),
        message: "Uploading CSV"
      }));
    });

    socket.on(campaignEvents.CSV_PROCESS_PROGRESSED, ({ progressPercent = 0 }) => {
      store.dispatch(ssActions.adCreationProgressed({
        progress: 10 + parseInt(progressPercent / 5),
        message: "Processing CSV"
      }));
    });

    const markErred = () => store.dispatch(ssActions.adCreationProgressed({
      progress: 0,
      hasErred: true
    }));

    socket.on(campaignEvents.CSV_PROCESS_ERRED, markErred);
    socket.on(errorEvents.MISSING_UID, markErred);
    socket.on(errorEvents.SESSION_EXPIRED, markErred);

    socket.on(campaignEvents.CSV_PROCESS_COMPLETED, ({ jobId } = {}) => {
      listenToSpreadsheetJob(jobId);
      store.dispatch(ssActions.adCreationProgressed({
        progress: 30,
        message: "Processing CSV"
      }));
    });
  }

  static async getInstance() {
    if (isUndefined(SSUploader.uploader)) {
      const uploader = new SSUploader();
      await uploader.init();
      SSUploader.uploader = uploader;
    }
    return SSUploader.uploader;
  }

  upload(file, data = {}) {
    file = Array.isArray(file) ? file[0] : file;
    const key = this.currentFileKey = getFileKey(file);
    store.dispatch(ssUploadActions.initiated({
      key
    }));
    file.meta = {
      ...file.meta,
      ...data
    };
    this.socketUploader.submitFiles([file]);
  }
}