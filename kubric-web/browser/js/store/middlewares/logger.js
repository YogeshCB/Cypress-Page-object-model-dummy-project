const logInfo = (text = "", { obj, format = '' }) => obj ? console.info(text, obj) : console.log(`%c${text}`, format);

export default store => next => action => {
  const currentState = store.getState();
  logInfo(`${action.type}`, { format: "background: #24d2fd; color: white; font-weight: bold" });
  logInfo('Previous State', { obj: currentState });
  logInfo('Action', { obj: action });
  const result = next(action);
  logInfo('New State', { obj: store.getState() });
  return result;
};
