import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'OPEN_UPLOAD',
    'CLOSE_UPLOAD',
    'AD_CREATION_PROGRESSED',
  ], 'kubric/campaign/ssupload'),
};