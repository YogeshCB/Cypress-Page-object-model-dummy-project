import logger from "./logger";
import config from "config";
import firestore from './firestore';
import FeatureGates from "@bit/kubric.utils.common.featuregates";
import { translateMap } from "../../isomorphic/constants/featuregates";

const gatesPath = config.get("firebase.refs.featuregates");

export default new FeatureGates(firestore, gatesPath, {
  logger,
  logOnReload: true,
  translateMap
});