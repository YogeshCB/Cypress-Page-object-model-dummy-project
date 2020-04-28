import polyfill from '@babel/polyfill';
import { h, render } from 'preact';
import Router from '@bit/kubric.utils.common.router';
import NotFound from './components/PageNotFound';
import store from './store';
import userActions from "./store/objects/user/actions";
import workspaceActions from "./store/objects/workspace/actions";
import { clearPrefetched } from "./lib/utils";
import 'stylesheets/app';
import routes from './routes';
import routeActions from "./store/objects/route/actions";
import FirebaseQueue from './lib/fbqueue';
import appActions from './store/objects/app/actions';
import Chat from './lib/chat';
import { Firebase } from "./lib/firebase";

const { userFetched } = userActions;
const { workspacesFetched } = workspaceActions;

const amplitudeRouteEvents = {
  '/campaigns': 'CAMPAIGNS_LOADED',
};

let firstLoadComplete = false;

const onRouteLoaded = (shellSpinnerElmt, routeResults, location) => {
  const { id: routeId } = routeResults[routeResults.length - 1];
  const { route } = location;
  if (__kubric_config__.env === 'production' && amplitudeRouteEvents[route]) {
    amplitude.getInstance().logEvent(amplitudeRouteEvents[route]);
  }
  store.dispatch(routeActions.routeLoaded({
    routeId,
    routes: [...routeResults],
    location: { ...location },
  }));
  if (!firstLoadComplete) {
    firstLoadComplete = true;
    store.dispatch(appActions.appLoaded());
  }
};

const onDocumentLoaded = async () => {
  const shellSpinnerElmt = document.querySelector('#shell-spinner');
  const contentElmt = document.querySelector('#content');

  store.dispatch(userFetched(clearPrefetched('user')));

  store.dispatch(workspacesFetched(clearPrefetched('workspace')));

  const router = new Router(routes, contentElmt, {
    store,
    onRouteLoaded: onRouteLoaded.bind(null, shellSpinnerElmt),
    notFoundComponent: NotFound
  });

  //Controlling the page spinner based on state changes
  store.subscribe(() => {
    const { spinner = {} } = store.getState();
    shellSpinnerElmt.classList[spinner.showSpinner ? 'remove' : 'add']('hide');
  });

  //initialize chat
  await Chat.getInstance().init();
  await Firebase.init();
  await FirebaseQueue.init();

  shellSpinnerElmt.classList.add('apploaded');
  shellSpinnerElmt.classList.add('hide');
  router.mount();
};

__kubric_config__.pageLoaded && onDocumentLoaded();

document.addEventListener('DOMContentLoaded', onDocumentLoaded);