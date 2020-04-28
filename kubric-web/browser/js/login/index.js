import babelPolyfill from "@babel/polyfill";
import 'stylesheets/login';
import { initialize as initializePopup } from './popup';
import { initialize as initializeNotifier } from './notifier';
import { addAuthEventListeners } from './util';
import addNotification from './notifier';

const getQueryParams = () =>
  location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((acc, param) => {
      const [query, value] = param.split('=');
      acc[query] = (typeof value !== 'undefined' && value.length > 0) ? value : undefined;
      return acc;
    }, {});

const checkNewUser = () => {
  const queries = getQueryParams();
  if (queries.verified === 'true') {
    addNotification('Your request for access to Kubric has been received and is under process.');
  } else if (typeof queries.error !== 'undefined') {
    const error = queries.error;
    if (error === 'unverified') {
      addNotification(`We were not able to verify your email. Please try signing up again.`, 'error');
    }
  }
};

function readDeviceOrientation() {

  if (Math.abs(window.orientation) === 90) {
    document.querySelector('#portrait-only').style.display = 'block';
  } else {
    document.querySelector('#portrait-only').style.display = 'none';
  }
}

window.onorientationchange = readDeviceOrientation;

window.addEventListener('load', () => {
  initializeNotifier();
  initializePopup();
  addAuthEventListeners();
  checkNewUser();
});
