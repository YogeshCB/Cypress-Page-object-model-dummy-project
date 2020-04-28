const updateState = (state, parameter, patch) => {
  const data = state.data;
  return {
    ...state,
    data: {
      ...data,
      [parameter]: patch
    },
  };
};

const DEFAULT_STATE = {
  data: {
    files: [],
    tags: [],
    attributes: [],
    fromDrop: false
  },
  status: false
};

export default (types, state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case types.SHOW_MODAL:
      return {
        ...state,
        data: {
          ...state.data,
          files: typeof action.payload.files === 'object'?action.payload.files: [...action.payload.files],
          fromDrop: !!action.payload.fromDrop
        },
        status: true
      };
    case types.SAVE_UPLOAD_DATA:
      return {
        ...updateState(state, 'files', [...action.payload.files], action),
      };
    case types.HIDE_MODAL:
      return {
        ...DEFAULT_STATE
      };
    case types.SAVE_LAST_DATA:
      return {
        ...state,
        backup: {
          ...action.payload
        }
      };
    case types.TAG_ADDED:
      return updateState(state, 'tags', [...state.data.tags, action.payload], action);

    case types.TAG_DELETED:
      return updateState(state, 'tags', state.data.tags.filter(val => val !== action.payload), action);

    case types.CHANGED_ATTRIBUTE:
      const { index, data } = action.payload;

      return updateState(state, 'attributes', [
        ...state.data.attributes.slice(0, index),
        {
          ...state.data.attributes[index],
          ...data,
        },
        ...state.data.attributes.slice(index + 1),
      ], action);

    case types.DELETED_ATTRIBUTE:
      return updateState(state, 'attributes', [
        ...state.data.attributes.slice(0, action.payload.index),
        ...state.data.attributes.slice(action.payload.index + 1),
      ], action);

    default:
      return state;
  }
};