import attrParsers from './parsers';

export const resolveAttributes = (attributes, valueMap) =>
  attributes.map(({ name, ...rest }) => ({
    ...rest,
    name,
    value: valueMap[name]
  }));

export const getAttrQuery = (attributes, valueMap) =>
  attributes.reduce((acc, { name }) => {
    const parser = attrParsers[name];
    if (valueMap[name]) {
      if (parser) {
        const values = parser(valueMap[name]);
        acc.push.apply(acc, values);
      } else {
        acc.push(`${name}:${valueMap[name]}`);
      }
    }
    return acc;
  }, []).join('#$!%#');