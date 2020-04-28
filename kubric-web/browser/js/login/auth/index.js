import addNotification from '../notifier';
import { postData } from '../../lib/utils';
import EmailProvider from './providers/email';
import GoogleProvider from './providers/google';
import { onAuthProcessed, onAuthProcessing } from '../util';
import { getUserData } from "./utils";

const providers = {
  email: EmailProvider,
  google: GoogleProvider,
};

const auth = (fnName, providerName, data) => {
  const provider = new providers[providerName](data);
  return provider[fnName]();
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const errors = {
  login: {
    'auth/user-not-found': 'This user does not exist. Please signup before logging in.'
  }
};

const firebaseErrorHandler = (from, err) => {
  let error = (errors[from] || {})[err.code];
  if (!error) {
    error = err.message;
  }
  addNotification(error, 'error');
  onAuthProcessed();
};

export const onLogin = (provider, data) => {
  auth('login', provider, data)
    .then(data => {
      postData('/user/login', {
        responseHandler: req => {
          const from = getParameterByName('from');
          if (req.status === 200) {
            /* Segment Event */
            analytics.identify(JSON.parse(req.response).userid, {
              userId: JSON.parse(req.response).userid,
              email: JSON.parse(req.response).email,
              name: JSON.parse(req.response).email
            });
            window.location.href = from !== null ? from : '/home';
          } else if (req.status === 401) {
            addNotification('Please confirm your email/password and try logging in again. If you are a new user, signup before attempting login.', 'error');
          } else if (req.status === 500) {
            addNotification('Unable to reach Kubric at the moment. We apologise for the inconvenience.', 'error');
          }
          onAuthProcessed();
        },
        data: getUserData(data.user),
      });
    })
    .catch(firebaseErrorHandler.bind(null, 'login'));
};

export const onSignup = (provider, data) => {
  onAuthProcessing();
  auth('signup', provider, data)
    .catch(firebaseErrorHandler.bind(null, 'signup'));
};
