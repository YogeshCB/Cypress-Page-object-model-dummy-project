import { getTypes } from "@bit/kubric.redux.reducks.utils";

export const validTypes = {
  'UPLOAD_INITIATED': true,
  'UPLOAD_COMPLETED': true,
  'UPLOAD_FAILED': true,
  'UPLOAD_PROGRESSED': true,
};

export const getTargetKey = (target, type) => `${target}/${type}`;

export default (target, type = 'image') => {
  if (!target || target.length === 0) {
    throw new Error('Uploader types should have a target');
  } else if (/\//.test(target)) {
    throw new Error('Uploader target name cannot have "/"');
  } else {
    return getTypes([
      'UPLOAD_INITIATED',
      'UPLOAD_COMPLETED',
      'UPLOAD_FAILED',
      'UPLOAD_PROGRESSED',
      'PURGE_UPLOAD_STATS',
    ], `kubric/uploader/${getTargetKey(target, type)}`);
  }
}