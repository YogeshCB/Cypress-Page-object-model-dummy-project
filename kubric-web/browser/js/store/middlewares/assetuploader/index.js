import fileUploaderWare from './file';
import batchProcessorWare from './batcher';
import folderUploadWare from './folder';
import dragNDropWare from './dragndrop';
import variantUploadWare from './variant';
import profilePicUploadWare from './profilepic';

export default [
  dragNDropWare,
  folderUploadWare,
  batchProcessorWare,
  fileUploaderWare,
  variantUploadWare,
  profilePicUploadWare
];