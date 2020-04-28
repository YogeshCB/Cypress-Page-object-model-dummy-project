import apiWares from '../authwares';
import injectSignup from './signup';
import injectLogin from './login';
import injectVerify from './verify';
import injectNotifications from './notifications';
import injectTemplateGeneration from './template';

const anonWares = [...apiWares, (req, res, next) => {
  req._isAnonymous = true;
  next();
}];

export default app => {
  injectSignup(app, anonWares);
  injectLogin(app, anonWares);
  injectVerify(app, anonWares);
  injectNotifications(app, anonWares);
  injectTemplateGeneration(app, anonWares);
};