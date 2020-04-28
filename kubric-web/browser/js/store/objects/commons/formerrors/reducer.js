import getTypes from "./types";

export default formName => {
  const types = getTypes(formName);
  return (state = {}, action) => {
    switch (action.type) {
      case types.SET_FORM_ERRORS:
        return {
          ...action.payload,
        };
      case types.CLEAR_FORM_ERROR:
        return {
          ...state,
          [action.payload]: undefined,
        };
      default:
        return state;
    }
  };
}