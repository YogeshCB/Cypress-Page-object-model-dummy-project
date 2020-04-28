import types from './types';
import { getActions } from "@bit/kubric.redux.reducks.utils";
import playerPack from "./player";
import parametersPack from "./parameters";

export default {
  ...getActions(types),
  ...playerPack.actions,
  ...parametersPack.actions
};
