import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default (formName = '') => getTypes([
  'SET_FORM_ERRORS',
  'CLEAR_FORM_ERROR',
], `kubric/formerrors/${formName.toUpperCase()}`)