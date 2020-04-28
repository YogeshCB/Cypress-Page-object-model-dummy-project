import { getFileAcceptTypes } from "./utils";
import config from '../config';

export const keyCodes = {
  ENTER: 13,
  AT: 50,
  BACKSPACE: 8,
  SPACE: 32,
  DOWN: 40,
  UP: 38,
  RIGHT: 39,
  LEFT: 37,
};

export const assetAcceptTypes = getFileAcceptTypes(config.assets.validAssetTypes);

export const assetWhiteList = getFileAcceptTypes(config.assets.validAssetTypes, true);