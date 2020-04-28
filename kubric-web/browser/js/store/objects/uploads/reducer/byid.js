export default (state = {}, action, types) => {
  const { extraData = {}, response = {}, progressPercent } = action.payload;
  const { __key__: key, title, description, type, time, target } = extraData;
  const currentTask = state[key];
  switch (action.type) {
    case types.UPLOAD_INITIATED:
      return {
        ...state,
        [key]: {
          title,
          description,
          type,
          time,
          target,
          uploading: true,
          progress: 0,
          status: 'initiated',
        },
      };
    case types.UPLOAD_FAILED:
      return {
        ...state,
        [key]: {
          ...currentTask,
          uploading: false,
          progress: 0,
          status: 'failed',
          hasErred: true,
        },
      };
    case types.UPLOAD_COMPLETED:
      return {
        ...state,
        [key]: {
          ...currentTask,
          uploading: false,
          progress: 100,
          status: 'completed',
          url: response ? response.url : undefined,
        },
      };
    case types.UPLOAD_PROGRESSED:
      return {
        ...state,
        [key]: {
          ...currentTask,
          progress: parseInt(progressPercent),
        },
      };
    default:
      return state;
  }
};
