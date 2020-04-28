import services from "../../services";
import config from "config";
import _ from 'lodash';
import logger from '../../lib/logger';
import messages from "../../lib/messages";

const cookieConfig = config.get('cookie');
const COOKIE_NAME = cookieConfig.name;

const parseSettings = settings => settings.reduce((acc, setting) => {
  acc = {
    ...acc,
    ...setting,
  };
  return acc;
}, {});

const loginWare = async (req, res, next) => {
  let data = req.body;
  if (!data.userid || !data.email) {
    res.status(400).send(messages.getResponseMessage('services.login.BAD_REQUEST'));
  } else {
    try {
      const results = await services.authenticate.login().send({
        ...data,
        appName: config.get('appName'),
      });
      logger.info({
        authenticateData: results,
      });
      data.roles = {};
      const profileData = results.profile;
      data.topics = profileData.topics;
      data.profile_image_url = profileData.profile_image_url;
      data.background_image_url = profileData.background_image_url;
      data.desc = profileData.desc;
      data.phone_no = profileData.phone_no;
      data.verified = profileData.verified;
      data.firstTimeLogin = results.login_count === 2;
      let rolesArr = results.profile.roles;
      for (let i = 0; i < rolesArr.length; i++) {
        let roleName = rolesArr[i].role;
        data.roles[roleName] = true;
      }
      let profile = results.profile || {};
      let filteredProfileData = {
        name: profile.name || data.name,
        email: profile.email || data.email,
      };
      if (profile.profile_image_url) {
        filteredProfileData.photo = profile.profile_image_url;
      }
      let saveData = _.assign({}, data, filteredProfileData);

      saveData.token = results.t;
      const settings = await services.settings.get().send(saveData);
      saveData.settings = parseSettings(settings.data);
      await req._sessionCache.setSession(data.userid, saveData);
      logger.info({
        responseData: saveData,
        token: saveData.token,
      });
      delete saveData.token;
      res.status(200).cookie(COOKIE_NAME, data.userid, cookieConfig.props).send(saveData);
    } catch (err) {
      logger.error(err);
      let status = err.status;
      if (status === 401) {
        if (err.response.body.is_new === 1) {
          res.status(401).send(messages.getResponseMessage('services.login.FIRST_TIME_USER', {
            email: data.email,
          }));
        } else if (err.response.body.status === 'nok') {
          res.status(401).send(messages.getResponseMessage('services.login.UNAPPROVED_USER', {
            email: data.email,
          }));
        } else {
          res.status(401).send();
        }
      } else {
        res.status(500).send(messages.getResponseMessage('services.login.FAILED'));
      }
    }
  }
};

export default (app, wares = []) => app.post('/user/login', [...wares, loginWare]);