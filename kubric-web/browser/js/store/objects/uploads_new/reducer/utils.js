import { isUndefined } from "@bit/kubric.utils.common.lodash";

export const getPayload = action => {
  let payload = action.payload || [];
  if (!Array.isArray(payload)) {
    if (!isUndefined(payload.data)) {
      payload = Array.isArray(payload.data) ? payload.data : [payload.data];
    } else {
      payload = [payload];
    }
  }
  return payload;
};