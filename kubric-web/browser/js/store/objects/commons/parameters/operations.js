import { getOperations } from "@bit/kubric.redux.reducks.utils";
import { isUndefined } from "@bit/kubric.utils.common.lodash";

const getActionObject = (parameter = {}, key, value) => {
  const obj = {
    ...parameter,
  };
  if (isUndefined(value)) {
    obj.value = key;
  } else {
    obj.value = value;
    obj.key = key;
  }
  return obj;
};

const onValueChanged = (actions, parameter, key, value) => dispatch =>
  dispatch(actions.parameterChanged(getActionObject(parameter, key, value)));

export default actions => ({
  ...getOperations(actions),
  onValueChanged: onValueChanged.bind(null, actions)
});
