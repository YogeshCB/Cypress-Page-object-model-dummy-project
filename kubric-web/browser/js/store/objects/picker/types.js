import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default getTypes([
  'PICK_ASSET',
  'OPEN_FILTERS',
  'PICKER_ASSETS_FETCHED',
  'CLOSE_FILTERS'
], `kubric/assetpicker`);