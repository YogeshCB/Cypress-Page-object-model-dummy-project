import mergeData from '@bit/kubric.media.video.mergeshots';
import { mapValues, isUndefined } from "@bit/kubric.utils.common.lodash";
import { mergeObjectArrays } from "../../lib/utils";

export const resolveShots = ({ shots = [], bindings = [], parameters = [] }) =>
  shots.map(({ template }, index) => {
    let parameter = parameters[index];
    if (!parameter) {
      parameter = mapValues(bindings[index] || {}, ({ default: defaultValue }) => defaultValue);
    }
    if (!isUndefined(template)) {
      return mergeData(template, parameter, {
        resolveAudio: false
      });
    }
    return {};
  });

export const metaResolver = ({ metaString }) => JSON.parse(metaString).editorMeta;

export const bindingsResolver = ({ allBindings, allParameters }) =>
  allParameters.map((shotParams, shotIndex) => {
    const bindings = allBindings[shotIndex];
    return Object.keys(shotParams)
      .reduce((acc, key) => {
        acc[key] = bindings[key];
        return acc;
      }, {});
  });

export const mergeParameters = ({ commonParameters = [], currentCreativeParameters = [] }) =>
  mergeObjectArrays(commonParameters, currentCreativeParameters);

export const mergeAndResolveShots = props => {
  const parameters = mergeParameters(props);
  return resolveShots({
    ...props,
    parameters
  })
};