import store from "../../../../store";

const ssupload = state => (state || store.getState()).campaign.ssupload;

const isModalOpen = state => ssupload(state).modalOpened;

const isCSVUploading = state => ssupload(state).isUploading;

const getCSVProgress = state => ssupload(state).adCreationProgress;

const isCSVUploadCompleted = state => ssupload(state).uploadCompleted;

export default {
  isModalOpen,
  isCSVUploading,
  getCSVProgress,
  isCSVUploadCompleted
};
