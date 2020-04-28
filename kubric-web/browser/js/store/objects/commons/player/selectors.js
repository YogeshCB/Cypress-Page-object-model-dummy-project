const isPlaying = getState => getState().playing;

const hasStartedPlaying = getState => getState().startedPlaying;

const getCurrentShot = getState => getState().currentShot;

export default getState => ({
  isPlaying: isPlaying.bind(null, getState),
  hasStartedPlaying: hasStartedPlaying.bind(null, getState),
  getCurrentShot: getCurrentShot.bind(null, getState)
});
