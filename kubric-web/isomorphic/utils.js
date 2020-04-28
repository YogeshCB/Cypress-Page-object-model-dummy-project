import { at } from "@bit/kubric.utils.common.lodash";

export const isProduction = () => {
  if (typeof __kubric_config__ !== "undefined") {
    return __kubric_config__.env === 'production';
  } else if (typeof process !== "undefined") {
    return process.env.NODE_ENV === 'production';
  }
  return false;
};

export const stringifyJson = (str, defaultValue) => {
  try {
    return JSON.parse(str);
  } catch (ex) {
    return defaultValue;
  }
};

export const parseCreativeMeta = ({ meta } = '{}') => {
  try {
    return JSON.parse(meta);
  } catch (ex) {
    return {};
  }
};

const creativeChatProperty = `chat-${isProduction() ? 'prod' : 'beta'}`;

const getFromMeta = (path, creative) => {
  const meta = parseCreativeMeta(creative);
  return at(meta, path)[0];
};

export const creativeChannelSidPath = `${creativeChatProperty}.creative.channelSid`;

export const getCreativeChannelSid = getFromMeta.bind(null, creativeChannelSidPath);

export const getCreativeChatSettings = getFromMeta.bind(null, `${creativeChatProperty}.creative`);