import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default id =>
  getTypes([
    'INITIATED',
    'COMPLETED',
    'FAILED',
    'PROGRESSED',
    'PURGE',
    'REPLACE_ENTRY'
  ], `kubric/uploads/${id}`);
