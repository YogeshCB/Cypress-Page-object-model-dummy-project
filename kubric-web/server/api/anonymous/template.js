import services from "../../services";
import { at, set, isUndefined, isNull } from '@bit/kubric.utils.common.lodash'
import { resolveBindings } from "../resolver";
import appCache from '../../lib/cache';

const EMAIL = 'sudo@kubric.io';
const TOKEN = 'To+SgWLDQDlaMLRx9ds8kvGTgKNLTmL6ApJ4qzH323h7e9fRdNeZSgdKlrfUEpEc7xRBHxQ1U0DkgprLqUmsps9Uwi+LU7GgZoSgXqqNP5M=';
const QUEUE_URL = 'https://res.cloudinary.com/dsvdhggfk/image/upload/v1538288895/demos/undraw_queue_qt30.png';

const getStringHash = s =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

const getAttributes = data => Object.keys(data).reduce((acc, name) => {
  acc.push({
    name,
    value: data[name]
  });
  return acc;
}, []);

const checkCache = async (req, res, next) => {
  const creativeType = req.creativeType = req.baseUrl.split('/')[2];
  const { refresh = false, ...attributeMap } = req.query;
  req.attributeMap = attributeMap;
  const cacheKey = req.cacheKey = getStringHash(JSON.stringify({
    creative: creativeType,
    template: req.params.templateId,
    attributes: attributeMap
  }));
  req.attributes = getAttributes({
    ...attributeMap,
    city_meta: "city"
  });
  const creativeId = req.creativeId = await appCache.getCreative(cacheKey);
  req.shouldGenerate = refresh === 'true' || isNull(creativeId) || isUndefined(creativeId);
  next();
};

const generateTemplateVideo = async (req, res) => {
  if (req.shouldGenerate) {
    const response = await services.templates.get().send({
      ...req.params,
      token: TOKEN,
      email: EMAIL
    });
    const [shots] = at(response, 'data.storyboard.shots');
    const [parameters] = at(response, 'data.bindings');
    const resolvedParameters = await resolveBindings(parameters, {
      attributes: req.attributes,
    }, EMAIL, TOKEN);
    const templates = shots.map(({ template }) => template);
    const { video = {} } = await services.video.generate().send({
      email: EMAIL,
      token: TOKEN,
      templates,
      parameters: resolvedParameters,
    });
    await appCache.setCreative(req.cacheKey, video._id);
    res.redirect(QUEUE_URL);
  } else {
    const { data: video } = await services.video.get().send({
      video: req.creativeId,
      token: TOKEN
    });
    const { url, status } = video;
    if (status === -1) {
      res.status(500).send();
    } else if (isNull(url) || isUndefined(url)) {
      res.redirect(QUEUE_URL);
    } else {
      res.redirect(url);
    }
  }
};

const generateCollage = async (req, res) => {
  if (req.shouldGenerate) {
    const response = await services.video.getCollage().send({
      ...req.params,
      token: TOKEN,
    });
    const [templates] = at(response, 'data.template');
    const parameters = at(response, 'data.params');
    parameters[0].city = {
      ...parameters[0].city,
      attributes: req.attributes,
      privateAssets: true
    };
    const resolvedParameters = await resolveBindings(parameters, {
      attributes: req.attributes
    }, EMAIL, TOKEN);
    if (!isUndefined(req.attributeMap.city)) {
      set(resolvedParameters, '0.CopyCityName.0', req.attributeMap.city);
    }
    const { task_id: taskId = {} } = await services.collage.generate().send({
      token: TOKEN,
      templates,
      parameters: resolvedParameters[0],
    });
    await appCache.setCreative(req.cacheKey, taskId);
    res.redirect(QUEUE_URL);
  } else {
    const { progress, meta, status } = await services.collage.getTaskStatus().send({
      taskId: req.creativeId,
      token: TOKEN
    });
    const { url } = meta;
    if (status === -1) {
      res.status(500).send();
    } else if (progress !== 100) {
      res.redirect(QUEUE_URL);
    } else {
      res.redirect(url);
    }
  }
};

export default (app, wares = []) => {
  app.use('/api/creative/video/:templateId', [...wares, checkCache, generateTemplateVideo]);
  app.use('/api/creative/collage/:collageId', [...wares, checkCache, generateCollage]);
}
