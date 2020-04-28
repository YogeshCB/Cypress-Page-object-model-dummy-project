import Express from 'express';
import config from 'config';
import { serviceHelper } from './utils';

const Router = Express.Router();
const COOKIE_NAME = config.get('cookie.name');

export const profileTransformer = ({ profile }) => ({
  ...profile,
});

//Retrieving current user
Router.get('/', (req, res) => {
  const data = req._sessionData;
  delete data.token;
  res.status(200).send(data);
});

Router.get('/profile', async (req, res) => {
  const { email, token } = req._sessionData;
  serviceHelper(res, {
    resource: 'profile',
    service: 'get',
    data: {
      email,
      token,
    },
    transformer: profileTransformer,
  });
});

Router.put('/profile', async (req, res) => {
  const data = req.body;
  const { token, email } = req._sessionData;
  if (data) {
    serviceHelper(res, {
      resource: 'profile',
      service: 'update',
      data: {
        token,
        email,
        ...data,
      },
    });
  }
});

//Logging out user
Router.post('/logout', (req, res) => {
  req._sessionCache.deleteSession(req._uid);
  res.status(200).clearCookie(COOKIE_NAME).send();
});

Router.get('/subscriptions', async (req, res) => {
  const { token } = req._sessionData;
  serviceHelper(res, {
    resource: 'mysubscriptions',
    service: 'getMySubscriptions',
    data: {
      token,
    }
  });
});

Router.get('/integrations/assets/credentials', (req, res)=> {
  serviceHelper(res, {
    resource: 'assets',
    service: 'getIntegrations',
    data: {
      ...req._sessionData
    }
  });
})
export default Router;
