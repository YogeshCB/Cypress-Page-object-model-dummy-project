import { getByIds } from "@bit/kubric.redux.state.utils";

export default {
  resolveStoryboards: ({ storyboardsByIds, storyboardIds }) => getByIds(storyboardsByIds, storyboardIds),
};