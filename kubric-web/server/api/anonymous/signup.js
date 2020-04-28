import Express from 'express';
import services from "../../services";
import config from "config";
import _ from 'lodash';
import firebase from '../../lib/firebase';
import { URL } from 'url';
import logger from '../../lib/logger';
import messages from "../../lib/messages";
import { IncomingWebhook }  from "@slack/client";

const Router = Express.Router();

Router.post('/', async (req, res, next) => {
  const data = req.body;
  if (!data.email) {
    res.status(400).send(messages.getResponseMessage('services.signup.BAD_REQUEST'));
  } else {
    try {
      const response = await services.authenticate.signup().send({
        ...data,
        token: config.get('api.token'),
        appName: config.get('appName'),
      });
      logger.info({
        responseData: response.body,
      });
      const webHookUrl = config.get('slack.leadsChannel.webhook');
      const slackWebhook = new IncomingWebhook(webHookUrl);
      const slackMessage = `Hey, we got a signup on the app - ${data.email}`;

      slackWebhook.send(slackMessage, (error, resp) => {
        if (error) {
          console.error(error);
        }
        console.log('Notification sent');
      });
      res.status(200).send(response.body);
    } catch (err) {
      logger.error(err);
      if (err.status === 409) {
        res.status(409).send({});
      } else {
        const [message] = _.at(err, 'response.body.message');
        res.status(500).send({
          message
        });
      }
    }
  }
});

Router.get('/verify', async (req, res, next) => {
  const { oobCode, mode, continueUrl } = req.query;
  const parsedUrl = new URL(continueUrl);
  const email = parsedUrl.searchParams.get('email');
  parsedUrl.searchParams.delete('email');
  switch (mode) {
    case 'verifyEmail':
      try {
        await firebase.auth().applyActionCode(oobCode);
        await services.profile.update().send({
          email,
          verified: 1,
          token: config.get('api.token'),
        });
        parsedUrl.searchParams.append('verified', 'true');
        res.redirect(parsedUrl.toString());
      } catch (err) {
        logger.error(err);
        parsedUrl.append('error', 'unverified');
        res.redirect(parsedUrl.toString);
      }
      break;
    default:
      logger.error({
        queryParams: req.query,
        message: 'Unsupported mode received from firebase',
      });
  }
});

export default (app, wares = []) => app.use('/user/signup', wares, Router);
