import assetResolver from './asset';
import textResolver from './text';

export const nonAssetSet = new Set(['text', 'color', '__other__']);

export default {
  text: textResolver,
  color: textResolver,
  '__other__': textResolver,
  image: assetResolver.bind(null, 'image'),
  video: assetResolver.bind(null, 'video'),
  audio: assetResolver.bind(null, 'audio'),
  subtitle: assetResolver.bind(null, 'subtitle'),
  "video,audio": assetResolver.bind(null, 'video,audio'),
};
