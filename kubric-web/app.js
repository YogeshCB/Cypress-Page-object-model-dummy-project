import config from 'config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { injectAPI } from './server/api';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import MobileDetect from 'mobile-detect';
import contentTypes from './server/lib/contenttypes';
import { renderView } from './server/viewhelpers/renderer';
import dataPrefetcher from './server/viewhelpers/prefetchers';
import injectAnonymousApi from './server/api/anonymous';
import logger from './server/lib/logger';
import apiWares from './server/api/authwares';
import Job from './server/lib/job';
import SessionHelper from '@bit/kubric.server.utils.session';
import SocketFileUpload from 'socketio-file-upload';
import featureGates from "./server/lib/featuregates";

const cookieConfig = config.get('cookie');
const NODE_ENV = process.env.NODE_ENV || 'development';
const assetsRoot = config.get('paths.assets');
const loginManifest = require(config.get('paths.loginManifest'));
const appManifest = require(config.get('paths.appManifest'));

const INDEX_URL = '/home';

export default (app, socketIo, appCache) => {
  const sessionHelper = new SessionHelper({
    cookie: cookieConfig,
    cache: appCache
  });

  //body-parser settings
  app.use(bodyParser.json({
    limit: '50mb',
  }));
  app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
  }));

  //Adding the socket file upload router
  app.use(SocketFileUpload.router);

  //Turning off unsafe headers for production security
  app.use(helmet());

  //gzip compression
  app.use(compression());

  //cookie-parser settings
  app.use(cookieParser());

  // static assets handler
  const staticHandler = express.static(assetsRoot, {
    maxAge: 86400000,
  });

  //statics settings
  app.use('/assets', (req, res, next) => {
    /\.gz$/.test(req.url) && res.setHeader('Content-Encoding', 'gzip');
    const [extension] = (req.url.match(/\.(js|css)/) || []);
    if (extension) {
      const contentType = contentTypes[extension];
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', `public, max-age=${10 * 365 * 24 * 60 * 60}`);
    }
    staticHandler(req, res, next);
  });

  sessionHelper.addSessionDataWares(app);

  app.use((req, res, next) => {
    const ua = req.headers['user-agent'];
    const md = new MobileDetect(ua);
    res.locals.isMobile = !!md.mobile();
    next();
  });

  app.use((req, res, next) => {
    req._featureGates = featureGates;
    next();
  });

  app.use((req, res, next) => {
    req._io = socketIo;
    next();
  });

  app.use((req, res, next) => {
    res.locals.env = NODE_ENV;
    res.locals.root = config.get('root');
    res.locals.studioRoot = config.get('studioRoot');
    res.locals.auth = JSON.stringify(config.get('firebase.loginConfig'));
    res.locals.queueAuth = JSON.stringify(config.get('firebase.config'));
    res.locals.intercomSettings = false;
    if (NODE_ENV === 'production') {
      res.locals.intercomSettings = JSON.stringify({
        app_id: config.get('intercom.appId'),
      });
    }
    next();
  });

  injectAnonymousApi(app);

  app.get('/', (req, res, next) => {
    if (req._sessionData) {
      res.redirect(INDEX_URL);
    } else {
      renderView(res, {
        name: 'login',
        data: {
          assets: {
            js: {
              app: loginManifest['login.js'],
              vendor: loginManifest['vendors~firebase.js'],
            },
          },
        },
      });
    }
  });

  app.get('*', async (req, res, next) => {
    if (!/(?:^\/api)/.test(req.path)) {
      if (!req._sessionData) {
        res.redirect(`${res.locals.root}?from=${req.path === '/' ? INDEX_URL : req.path}`);
      } else {
        if (req.path === '/') {
          res.redirect(INDEX_URL);
        } else {
          if (res.locals.intercomSettings) {
            const parsed = JSON.parse(res.locals.intercomSettings);
            res.locals.intercomSettings = JSON.stringify({
              ...parsed,
              user_id: req._sessionData.userid,
              name: req._sessionData.name,
              email: req._sessionData.email,
              workspace: req._sessionData.workspace_id
            })
          }
          renderView(res, {
            name: 'shell',
            data: {
              assets: {
                js: {
                  app: appManifest['app.js'],
                  vendor: appManifest['vendor.js'],
                },
                css: {
                  app: appManifest['app.css'],
                }
              },
              dataProvider: dataPrefetcher(req),
            },
          });
        }
      }
    } else {
      next();
    }
  });

  app.use(apiWares);

  sessionHelper.addAuthWares(app);

  //authenticates apis
  injectAPI(app);

  app.use('/api/jobs', Job.getJobRoutes(['kubric', {
    app: 'kubric-publisher',
    jobs: 'FacebookAdJob'
  }, 'asset_library']));

  //logging all errors
  app.use((errObj, req, res, next) => {
    const clientError = logger.error(errObj);
    next(clientError);
  });

  //handling api errors
  app.use((err, req, res, next) => {
    if (req._isApi) {
      res.send(err);
    } else {
      res.send({
        error: 'Something failed',
      });
    }
  });

  return app;
};
