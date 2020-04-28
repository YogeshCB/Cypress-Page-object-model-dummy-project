import creativesListPack from "../list";

export default (state = {}, action) => {
  const types = creativesListPack.types;
  switch (action.type) {
    case types.SELECTED_ROWS_CHANGE:
      return {
        ...state,
        ...action.payload.data,
      };
    case types.CLEAR_ROW_SELECTIONS:
      return {};
    default:
      return state;
  }
};
