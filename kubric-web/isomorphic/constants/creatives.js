export default {
  ID_FIELD: 'uid',
};

export const creativeTabs = {
  FILTERED: "filters",
  ALL: "all",
  FAILED: "failed",
  GENERATED: "generated",
  PUBLISHED: "published",
  INPROGRESS: "inprogress",
  READY: "ready"
};

export const statuses = {
  CREATION_COMPLETED: "creation-completed",
  CREATION_ERRED: "creation-erred",
  GENERATION_PENDING: "generation-pending",
  GENERATION_INPROGRESS: "generation-inprogress",
  GENERATION_COMPLETED: "generation-completed",
  GENERATION_ERRED: "generation-erred",
  PUBLISH_PENDING: "publish-pending",
  PUBLISH_INPROGRESS: "publish-inprogress",
  PUBLISH_COMPLETED: "publish-completed",
  PUBLISH_ERRED: "publish-erred",
};

export const tabsToStatusMap = {
  [creativeTabs.READY]: statuses.CREATION_COMPLETED,
  [creativeTabs.INPROGRESS]: [statuses.GENERATION_INPROGRESS, statuses.PUBLISH_INPROGRESS, statuses.GENERATION_PENDING, statuses.PUBLISH_PENDING],
  [creativeTabs.FAILED]: [statuses.CREATION_ERRED, statuses.PUBLISH_ERRED, statuses.GENERATION_ERRED],
  [creativeTabs.GENERATED]: statuses.GENERATION_COMPLETED
};

export const statsPathMap = {
  [statuses.GENERATION_COMPLETED]: 'generated',
  [statuses.PUBLISH_COMPLETED]: 'published',
  [statuses.CREATION_ERRED]: ['failed.all', 'failed.missingAssets'],
  [statuses.GENERATION_ERRED]: ['failed.all', 'failed.generation'],
  [statuses.PUBLISH_ERRED]: 'failed.publish',
  [statuses.GENERATION_PENDING]: ['inprogress.all', 'inprogress.generation'],
  [statuses.PUBLISH_PENDING]: ['inprogress.all', 'inprogress.publish'],
  [statuses.GENERATION_INPROGRESS]: ['inprogress.all', 'inprogress.generation'],
  [statuses.PUBLISH_INPROGRESS]: ['inprogress.all', 'inprogress.publish'],
  [statuses.CREATION_COMPLETED]: 'ready'
};

export const generationStatuses = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  FAILED: -1
};

