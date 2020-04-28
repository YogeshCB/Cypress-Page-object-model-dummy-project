import services from '../services';
import Route from 'route-parser';
import { profileTransformer } from '../api/user';
import { campaignsTransformer } from "../api/campaigns";
import { responseTransformer } from "../api/utils";
import { storyboardsTransformer } from "../api/storyboards";
import { templatesTransformer } from "../api/templates";
import { statsTransformer } from "../api/campaign/creatives";

const fetchers = {
  user({ _sessionCache, _uid }) {
    return _sessionCache.getSession(_uid)
      .then(res => {
        delete res.token;
        return res;
      });
  },
  workspace({ _sessionData }) {
    return services.workspace.getWorkspacesOfUser()
      .send(_sessionData)
  },
  profile({ _sessionData }) {
    return services.profile.get()
      .transform(profileTransformer)
      .send(_sessionData);
  },
  storyboards({ _sessionData }) {
    return services.storyboards.get()
      .transform(storyboardsTransformer)
      .send({
        ..._sessionData,
        limit: 50,
      });
  },
  templates({ _sessionData }) {
    return services.templates.get()
      .transform(templatesTransformer)
      .send(_sessionData);
  },
  template({ _sessionData }, { template: templateId }) {
    return services.templates.get()
      .transform(responseTransformer)
      .send({
        ..._sessionData,
        templateId,
      });
  },
  segments({ _sessionData }) {
    return services.segments.get()
      .send({
        ..._sessionData,
        limit: 30
      });
  },
  campaigns({ _sessionData }) {
    return services.campaigns.get()
      .transform(campaignsTransformer)
      .send(_sessionData);
  },
  recentCampaigns({ _sessionData }) {
    return services.campaigns.get()
      .transform(campaignsTransformer)
      .send({
        ..._sessionData,
        limit: 5
      });
  },
  campaign({ _sessionData }, { campaign }) {
    return services.campaign.get()
      .transform(responseTransformer)
      .send({
        ..._sessionData,
        campaign,
      });
  },
  attributes({ _sessionData }) {
    return services.segments.getAttributes()
      .transform(responseTransformer)
      .send(_sessionData);
  },
  creative({ _sessionData }, { campaign, creative }) {
    return services.campaign.getAd()
      .transform(responseTransformer)
      .send({
        ..._sessionData,
        campaign,
        ad: creative
      });
  },
  creatives({ _sessionData }, { campaign }) {
    return services.campaign.getAds()
      .send({
        ..._sessionData,
        campaign,
        limit: 50
      });
  },
  stats({ _sessionData }, { campaign }) {
    return services.campaign.getCount()
      .transform(statsTransformer)
      .send({
        ..._sessionData,
        campaign,
      });
  }
};

const routeMap = [{
  route: '/profile',
  fetchers: ['user', 'workspace', 'profile']
}, {
  route: '/home',
  fetchers: ['user', 'workspace']
}, {
  route: '/apps',
  fetchers: ['user', 'workspace']
}, {
  route: '/campaigns',
  fetchers: ['user', 'workspace']
}, {
  route: '/catalogue',
  fetchers: ['user', 'workspace']
}, {
  route: '/feedcards',
  fetchers: ['user', 'workspace']
}, {
  route: '/banners',
  fetchers: ['user', 'workspace']
}, {
  route: '/campaign',
  fetchers: ['user', 'workspace']
}, {
  route: '/campaign/storyboards',
  fetchers: ['user', 'workspace', 'storyboards']
}, {
  route: '/campaign/:campaign/creative/:creative/edit',
  fetchers: ['user', 'workspace', 'campaign', 'creative']
}, {
  route: '/campaign/:campaign/customize',
  fetchers: ['user', 'workspace']
}, {
  route: '/campaign/:campaign/creatives',
  fetchers: ['user', 'workspace']
}, {
  route: '/campaign/:campaign',
  fetchers: ['user', 'workspace', 'campaign', 'stats']
}, {
  route: '/userassets',
  fetchers: ['user', 'workspace']
}, {
  route: '/workspace',
  fetchers: ['user', 'workspace']
}, {
  route: '/userassets/:folderId',
  fetchers: ['user', 'workspace']
}, {
  route: '/sourcing',
  fetchers: ['user', 'workspace']
}, {
  route: '/security',
  fetchers: ['user', 'workspace']
}, {
  route: '/',
  fetchers: ['user', 'workspace']
}, {
  route: '/messages',
  fetchers: ['user', 'workspace']
}];

export default req => {
  let params, currentRouteConf;
  for (let i = 0; i < routeMap.length; i++) {
    const { route: path } = routeMap[i];
    const route = new Route(path);
    const match = route.match(req.path);
    if (match) {
      params = match;
      currentRouteConf = routeMap[i];
      break;
    }
  }
  console.log(params);
  if (currentRouteConf) {
    const { fetchers: fetcherNames } = currentRouteConf;
    const fetcherPromises = fetcherNames.map(fetcher => typeof fetcher === 'string' ? fetchers[fetcher](req, params) : fetchers[fetcher.fetcher](req, params));
    return Promise.all(fetcherPromises)
      .then(responses =>
        fetcherNames.reduce((results, fetcher, index) => {
          fetcher = typeof fetcher === 'string' ? fetcher : fetcher.datakey;
          return {
            ...results,
            [fetcher]: responses[index],
          };
        }, {}))
      .catch(console.log);
  }
  return false;
};
