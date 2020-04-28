import campaignSelectors from "../selectors";
import config from "../../../../config";

export const getSelectedStoryboards = () => campaignSelectors.getSelectedStoryboards()
  .map(({ id, versions = [] }) => ({
    id,
    version: versions.length > 0 ? versions[versions.length - 1] : config.defaultSBVersion
  }));
