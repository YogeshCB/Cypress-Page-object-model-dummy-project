export const attributeChanged = (asset, action) => {
  const { payload } = action;
  const { custom_attributes: customAttributes = [] } = asset;
  const { index, data } = payload;
  return {
    ...asset,
    custom_attributes: [
      ...customAttributes.slice(0, index),
      {
        ...customAttributes[index],
        ...data,
      },
      ...customAttributes.slice(index + 1),
    ],
  };
};

export const attributeDeleted = (asset = {}, action) => {
  const { payload } = action;
  const { custom_attributes: customAttributes = [] } = asset;
  const { index } = payload;
  return {
    ...asset,
    custom_attributes: [
      ...customAttributes.slice(0, index),
      ...customAttributes.slice(index + 1),
    ],
  };
};