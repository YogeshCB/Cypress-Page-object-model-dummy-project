import { h } from 'preact';
import { Spinner } from "./components";
import routeStyles from 'stylesheets/routes';

export const HOME_ROUTE = 'home';
export const APPS_ROUTE = 'apps';
export const CAMPAIGNS_ROUTE = 'campaigns';
export const CATALOGUE_ROUTE = 'catalogue';
export const FEEDCARDS_ROUTE = 'feedcards';
export const BANNERS_ROUTE = 'banners';
export const ASSETS_ROUTE = 'assets';
export const CREATED_CAMPAIGN_ROUTE = 'createdCampaign';
export const ASSET_ROUTE = 'asset';
export const CAMPAIGN_SB_ROUTE = 'campaignStoryboards';
export const SOURCING_ROUTE = 'sourcing';
export const SECURITY_ROUTE = 'security';
export const MESSAGES_ROUTE = 'message';

const SpinnerComponent = () => <Spinner theme={{ overlay: routeStyles.overlay }}/>;

export default {
  index: '/home',
  path: '/',
  id: 'root',
  component: () => import ( /* webpackChunkName: 'content' */ './pages/Content'),
  transitional: true,
  routes: [{
    path: '/home',
    id: HOME_ROUTE,
    component: () => import ( /* webpackChunkName: 'home' */ './pages/Home')
  }, {
    path: '/apps',
    id: APPS_ROUTE,
    component: () => import ( /* webpackChunkName: 'apps' */ './pages/Apps'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/campaigns',
    id: CAMPAIGNS_ROUTE,
    component: () => import ( /* webpackChunkName: 'campaigns' */ './pages/Campaigns'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/catalogue',
    id: CATALOGUE_ROUTE,
    component: () => import ( /* webpackChunkName: 'campaigns' */ './pages/Campaigns'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/feedcards',
    id: FEEDCARDS_ROUTE,
    component: () => import ( /* webpackChunkName: 'campaigns' */ './pages/Campaigns'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/banners',
    id: BANNERS_ROUTE,
    component: () => import ( /* webpackChunkName: 'campaigns' */ './pages/Campaigns'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/campaign',
    id: 'newCampaign',
    transitional: true,
    component: () => import ( /* webpackChunkName: 'campaign' */ './pages/Campaign'),
    routes: [{
      path: '/storyboards',
      id: CAMPAIGN_SB_ROUTE,
      component: () => import ( /* webpackChunkName: 'campaign' */ './pages/campaign/Storyboards'),
      loadingComponent: SpinnerComponent
    }, {
      path: '/:campaign/creative/bulk/edit',
      id: 'creativeEdit',
      component: () => import ( /* webpackChunkName: 'campaign' */ './pages/campaign/BulkCreativeEditor'),
      loadingComponent: SpinnerComponent
    }, {
      path: '/:campaign/creative/:id/edit',
      id: 'creativeEdit',
      component: () => import ( /* webpackChunkName: 'campaign' */ './pages/campaign/CreativeEditor'),
      loadingComponent: SpinnerComponent
    }, {
      path: '/:campaign',
      id: CREATED_CAMPAIGN_ROUTE,
      component: () => import ( /* webpackChunkName: 'campaign' */ './pages/campaign/CreatedCampaign'),
      loadingComponent: SpinnerComponent
    }]
  }, {
    path: '/profile',
    id: 'profile',
    data: {
      heading: 'Account Profile'
    },
    component: () => import ( /* webpackChunkName: 'profile' */ './pages/Profile'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/workspace',
    id: 'workspace',
    data: {
      heading: 'Manage Workspace'
    },
    component: () => import ( /* webpackChunkName: 'workspace' */ './pages/Workspace'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/security',
    id: SECURITY_ROUTE,
    data: {
      heading: 'Security'
    },
    component: () => import ( /* webpackChunkName: 'security' */ './pages/Security'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/messages',
    id: MESSAGES_ROUTE,
    data: {
      heading: 'Notifications'
    },
    component: () => import ( /* webpackChunkName: 'security' */ './pages/Messages'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/userassets/:folderId',
    id: ASSET_ROUTE,
    component: () => import ( /* webpackChunkName: 'assets' */ './pages/Assets'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/userassets',
    id: ASSETS_ROUTE,
    component: () => import ( /* webpackChunkName: 'assets' */ './pages/Assets'),
    loadingComponent: SpinnerComponent
  }, {
    path: '/sourcing',
    id: SOURCING_ROUTE,
    component: () => import ( /* webpackChunkName: 'sourcing' */ './pages/Sourcing'),
    loadingComponent: SpinnerComponent
  }
  ]
};
