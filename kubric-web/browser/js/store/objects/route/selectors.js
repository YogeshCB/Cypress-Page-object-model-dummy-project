import store from '../../index';
import Resolver from '@bit/kubric.utils.common.json-resolver';
import { at } from "@bit/kubric.utils.common.lodash";

const route = state => (state || store.getState()).route;

const getLastRoute = state => {
  const { routes: currentRoutes = [] } = route(state);
  let lastRoute;
  if (currentRoutes.length > 0) {
    lastRoute = currentRoutes[currentRoutes.length - 1];
  }
  return lastRoute;
};

const getRouteId = state => route(state).routeId;

const getRouteData = state => {
  const lastRoute = getLastRoute(state);
  let data = {
    routeId: getRouteId(state),
  };
  if (lastRoute) {
    data = {
      ...data,
      ...(lastRoute.data || {})
    };
  }
  return data;
};

const getPageQuery = state => route(state).location.query;

const resolvePageHeading = state => {
  const resolver = new Resolver();
  const route = getLastRoute(state);
  let [heading] = at(route, 'data.heading', '');
  if (heading) {
    heading = resolver.resolve(heading, state);
  }
  return heading;
};

const getRouteParams = state => route(state).location.params;

const getCurrentRoute = state => route(state).location.route;

export default {
  getRouteData,
  resolvePageHeading,
  getPageQuery,
  getRouteId,
  getRouteParams,
  getCurrentRoute
};