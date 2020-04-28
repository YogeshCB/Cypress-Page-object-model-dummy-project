import routeTypes from "./types";

export default (state = {}, action) => {
  switch (action.type) {
    case routeTypes.ROUTE_LOADED:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};