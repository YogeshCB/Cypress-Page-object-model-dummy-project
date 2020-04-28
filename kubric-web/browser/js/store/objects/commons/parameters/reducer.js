import reducerFactory from "@bit/kubric.redux.reducers.factory";
import { combineReducers } from "redux";
import { isUndefined, isFunction } from "@bit/kubric.utils.common.lodash";
import { composeReducers } from "@bit/kubric.redux.reducers.utils";

const parameters = (types, selectors) => (state = [], action) => {
  switch (action.type) {
    case types.PARAMETER_CHANGED: {
      const currentShot = selectors.getSelectedShot();
      const currentParameters = state[currentShot];
      const { parameter, parent, value } = action.payload;
      const mainParam = parent || parameter;
      const subParam = !isUndefined(parent) ? parameter : undefined;
      let newParameter = value;
      if (!isUndefined(subParam)) {
        const currentParameter = currentParameters[mainParam];
        if (Array.isArray(currentParameter)) {
          newParameter = [
            ...currentParameter.slice(0, +subParam),
            value,
            ...currentParameter.slice(+subParam + 1)];
        } else {
          newParameter = {
            ...currentParameter,
            [subParam]: value
          };
        }
      }
      return [
        ...state.slice(0, currentShot),
        {
          ...currentParameters,
          [mainParam]: newParameter
        },
        ...state.slice(currentShot + 1),
      ]
    }
    default:
      return state;
  }
};

const loading = (types, selectors) => (state = [], action) => {
  const update = (parameter, isLoading) => {
    const currentShot = selectors.getSelectedShot();
    return [
      ...state.slice(0, currentShot),
      {
        ...(state[currentShot] || {}),
        [parameter]: isLoading
      },
      ...state.slice(currentShot + 1)
    ]
  };
  switch (action.type) {
    case types.PARAMETER_LOADING:
      return update(action.payload, true);
    case types.PARAMETER_LOADED:
      return update(action.payload, false);
    default:
      return state;
  }
};

export default (types, selectors, extReducer) => {
  const reducers = [parameters(types, selectors)];
  isFunction(extReducer) && reducers.push(extReducer);
  return combineReducers(reducerFactory({
    reducers: {
      data: {
        defaultState: [],
        reducer: composeReducers(reducers)
      },
      loading: {
        defaultState: [],
        reducer: loading(types, selectors)
      },
      shot: {
        defaultState: 0,
        types: types.SHOT_SELECTED,
      }
    }
  }))
};