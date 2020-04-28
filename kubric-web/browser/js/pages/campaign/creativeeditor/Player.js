import { connect } from "preact-redux";
import Player from './player/index';
import Resolver from "../../../mixins/PropResolver";
import creativeSelectors from "../../../store/objects/campaign/creative/selectors";
import creativeOperations from "../../../store/objects/campaign/creative/operations";
import bulkEditSelectors from "../../../store/objects/campaign/bulkedit/selectors";
import bulkEditOperations from "../../../store/objects/campaign/bulkedit/operations";
import { resolveShots, mergeParameters, mergeAndResolveShots } from "../resolvers";

const ResolvedSinglePlayer = Resolver(Player, {
  resolvedShots: resolveShots,
});

export const SinglePlayer = connect(state => ({
  shots: creativeSelectors.getShots(state),
  parameters: creativeSelectors.getParameters(state),
  playing: creativeSelectors.isPlaying(state),
  currentShot: creativeSelectors.getCurrentShot(state),
  startedPlaying: creativeSelectors.hasStartedPlaying(state),
}), {
  ...creativeOperations,
})(ResolvedSinglePlayer);

const ResolvedBulkPlayer = Resolver(Player, {
  parameters: mergeParameters,
  resolvedShots: mergeAndResolveShots
});


export const BulkPlayer = connect(state => ({
  shots: bulkEditSelectors.getShots(state),
  commonParameters: bulkEditSelectors.getParameters(state),
  playing: bulkEditSelectors.isPlaying(state),
  currentShot: bulkEditSelectors.getCurrentShot(state),
  startedPlaying: bulkEditSelectors.hasStartedPlaying(state),
  currentCreativeParameters: bulkEditSelectors.getCurrentCreativeParameters(state),
  controller: true
}), {
  ...bulkEditOperations,
})(ResolvedBulkPlayer);