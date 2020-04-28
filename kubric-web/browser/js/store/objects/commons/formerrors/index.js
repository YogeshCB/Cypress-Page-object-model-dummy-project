import reducer from "./reducer";
import { getActions } from "@bit/kubric.redux.reducks.utils";
import getTypes from './types';

export const getFormErrorActions = formName => getActions(getTypes(formName));

export default reducer;