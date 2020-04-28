import { serviceHelper } from "../../../utils";
import services from "../../../../services";
import * as URL from "url";
import { URLSearchParams } from "url";
import config from 'config';
import Express from 'express';
import { updateProfile } from "../../wares";
import logger from '../../../../lib/logger';

const root = config.get('root');
const Router = Express.Router();

const getOAuthUrl = (req, addNetworkQuery = false) => {
  const redirectUrl = URL.parse(req.query.redirect);
  const searchParams = new URLSearchParams(redirectUrl.search);
  if (addNetworkQuery) {
    searchParams.append('network', 'drive');
    redirectUrl.search = searchParams.toString();
  }
  return `${root}/api/assets/networks/drive/oauth/callback?redirect=${encodeURIComponent(URL.format(redirectUrl))}`;
};

const getRedirectUrl = (req, error) => {
  let { redirect } = req.query;
  const redirectUrl = URL.parse(redirect);
  if (error) {
    redirectUrl.search = `error=${error}`;
  }
  return URL.format(redirectUrl);
};

const handleCallback = async (req, res, next) => {
  const url = `${config.get('root')}${req.originalUrl}`;
  try {
    const oAuthRedirect = getOAuthUrl(req);
    await services.drive.callback().send({
      ...req._sessionData,
      url,
      redirect: oAuthRedirect,
    });
    next();
  } catch (ex) {
    logger.error(ex);
    res.redirect(getRedirectUrl(req, 'DRIVE_CALLBACK_FAILED'));
  }
};

const redirectToApp = (req, res) => res.redirect(getRedirectUrl(req));

const getAuthorizeURL = (req, res) => {
  const oAuthRedirect = getOAuthUrl(req, true);
  serviceHelper(res, {
    resource: 'drive',
    service: 'getOAuthUrl',
    data: {
      redirect: oAuthRedirect,
      ...req._sessionData,
    }
  });
};

Router.get('/', getAuthorizeURL);

Router.get('/callback', [
  handleCallback,
  updateProfile('asset', 'drive', {
    isConnected: true,
  }, (req, res, ex) => {
    logger.error(ex);
    res.redirect(getRedirectUrl(req, 'DRIVE_CALLBACK_FAILED'));
  }),
  redirectToApp,
]);

export default Router;

