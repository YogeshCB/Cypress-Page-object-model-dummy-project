import services from "../../services";
import logger from '../../lib/logger';

const notificationWare = async (req, res, next) => {
  const headers = req.headers;
  try {
    res.status(200).send({ message: 'Sent Successfully' });
    await services.assets.notifications().send({
      ...headers,
      'X-Kubric-Channel-ID': req.headers['x-goog-channel-id'],
      'X-Kubric-Resource-ID': req.headers['x-goog-resource-id'],
      'X-Kubric-Message-Number': req.headers['x-goog-message-number'],
      postData: {
        ...headers,
        'X-Kubric-Channel-ID': req.headers['x-goog-channel-id'],
        'X-Kubric-Resource-ID': req.headers['x-goog-resource-id'],
        'X-Kubric-Message-Number': req.headers['x-goog-message-number'],
      }
    });
  } catch (err) {
    logger.error(err);
  }
};

export default (app, wares = []) => app.post('/api/notifications', [...wares, notificationWare]);