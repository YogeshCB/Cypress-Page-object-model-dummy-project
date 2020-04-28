import rtManager from '../../lib/rtmanager';

export default store => next => action => {
  const type = action.type;
  setImmediate(() => {
    rtManager.unlisten(type, action);
    rtManager.listen(type, action);
  });
  return next(action);
};
