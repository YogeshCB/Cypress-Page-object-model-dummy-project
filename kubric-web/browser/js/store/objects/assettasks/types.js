import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default getTypes([
  'FETCH_ASSET_TASK',
  'SAVE_ASSET_TASK',
  'PURGE_ASSET_TASK',
  'SAVE_CHILD_DATA',
  'DELETE_ASSET_TASK',
  'REPLACE_TASK_ROW',
  'SAVE_FOLDER_MAP'
], 'kubric/tasks');