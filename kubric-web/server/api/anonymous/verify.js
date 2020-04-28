import services from "../../services";
import logger from '../../lib/logger';
import messages from "../../lib/messages";

const verifyWare = async (req, res, next) => {
  let token = req.query.t;
  try {
    await services.authenticate.verify().send({
      token,
    });
    res.redirect('/');
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.verify.FAILED'));
  }
};

export default (app, wares = []) => app.get('/user/verify', [...wares, verifyWare]);