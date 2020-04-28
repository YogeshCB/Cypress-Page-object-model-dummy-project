import { responseTransformer, serviceHelper, getDate } from "../utils";
import services from "../../services";
import csv from "fast-csv";
import logger from "../../lib/logger";
import messages from "../../lib/messages";
import Resolver from '@bit/kubric.utils.common.json-resolver';
import _ from 'lodash';
import { campaignStatus } from "../../../isomorphic/constants/queue";
import { tabsToStatusMap } from "../../../isomorphic/constants/creatives";

const ADS_FETCH_LIMIT = 10;

const get = (req, res) => {
  const { campaign } = req.params;
  serviceHelper(res, {
    resource: 'campaign',
    service: 'get',
    data: {
      ...req._sessionData,
      ...req.query,
      campaign,
    },
    transformer(res) {
      const transformedRes = responseTransformer(res);
      return {
        ...transformedRes,
        desc: getDate(transformedRes.created_on),
        updatedOnString: getDate(transformedRes.updated_on)
      }
    },
  });
};

const getAds = (req, res) => {
  let { status, tabs, selfassigned = false } = req.query;
  status = _.isUndefined(status) ? (tabsToStatusMap[tabs] || '') : status;
  const serviceData = {
    ...req._sessionData,
    ...req.params,
    ...req.query,
    status,
  };
  if (selfassigned) {
    serviceData.assignedTo = req._sessionData.email;
  }
  serviceHelper(res, {
    resource: 'campaign',
    service: 'getAds',
    data: serviceData,
    transformer: ({ data = [], next, totalHits }) => ({
      next,
      totalHits,
      data: data.map(({ created_on, updated_on, generated_creatives, ...rest }) => ({
        ...rest,
        generated_creatives: generated_creatives ? generated_creatives.reverse() : [],
        created_on: created_on,
        updated_on: updated_on
      })),
    }),
  });
};

const getAd = (req, res) => {
  serviceHelper(res, {
    resource: 'campaign',
    service: 'getAd',
    data: {
      ...req._sessionData,
      ...req.params,
    },
    transformer: responseTransformer,
  });
};

const getCampaignAds = async (serviceName, status, req, res, next) => {
  try {
    let ads = [];
    const fetchAds = start =>
      services.campaign.getAds()
        .send({
          ...req._sessionData,
          ...req.params,
          'X-Kubric-Workspace-ID': req._sessionData.workspace_id,
          status,
          start,
          limit: ADS_FETCH_LIMIT
        })
        .then(resp => {
          const { data = [], next: start } = resp;
          ads.push(...data);
          if (!_.isUndefined(start)) {
            return fetchAds(start);
          } else {
            return ads
          }
        })
        .catch(ex => {
          logger.error(ex);
          res.status(500).send(messages.getResponseMessage(`services.${serviceName}.RETRIEVAL_FAILED`));
        });
    req._campaignData = await fetchAds();
    next();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.${serviceName}.RETRIEVAL_FAILED`));
  }
};

const setCsvStream = (serviceName, prefix, req, res, next) => {
  try {
    const csvStream = req._csvStream = csv.createWriteStream({ headers: true });
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${prefix}_${req.params.campaign}_${Date.now()}.csv`
    });
    csvStream.pipe(res);
    next();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.${serviceName}.CSV_FAILED`));
  }
};

const downloadVideoCSV = async (req, res, next) => {
  try {
    const data = req._campaignData;
    const resolver = new Resolver({
      replaceUndefinedWith: ''
    });
    const csvStream = req._csvStream;
    data.forEach(ad => csvStream.write(resolver.resolve({
      uid: "{{uid}}",
      status: "{{status}}",
      aud_id: "{{source.segment.name}}",
      aud_name: "{{source.segment.display_name}}",
      video_url: "{{content.video.url}}",
      watermarked_url: "{{content.video.watermarkUrl}}",
      thumbnail_url: "{{content.video.thumbnail}}"
    }, ad)));
    csvStream.end();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.downloadAdResults.DOWNLOAD_FAILED`));
  }
};

const downloadAdErrorsCSV = async (req, res, next) => {
  try {
    const data = req._campaignData;
    const resolver = new Resolver({
      replaceUndefinedWith: ''
    });
    const csvStream = req._csvStream;
    data.forEach(ad => {
      const { meta = "{}", uid, } = ad;
      let errors = [];
      try {
        errors = JSON.parse(meta).errors;
      } catch (ex) {
        res.status(500).send(messages.getResponseMessage(`services.downloadAdResults.INVALID_ERROR_META`, {
          ad: uid
        }));
      }
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach(error => {
          Object.keys(error).forEach(parameter => {
            const { parametrized } = error[parameter];
            const csvData = {
              uid: "{{ad.uid}}",
              status: "{{ad.status}}",
              aud_id: "{{ad.source.segment.name}}",
              aud_name: "{{ad.source.segment.display_name}}",
              parameter,
              parametrized: "{{error.parametrized}}",
              column_value: "{{error.attrValue}}",
              default_value: "{{error.defaultValue}}",
              error_message: '{{error.message}}',
              resolution_url: "{{error.url}}",
              resolution_status: "{{error.status}}"
            };
            if (parametrized) {
              csvData.column_header = "{{error.column.colId}}";
              csvData.column_value = "{{error.attrValue}}";
            }
            csvStream.write(resolver.resolve(csvData, {
              ad,
              error: error[parameter]
            }));
          });
        });
      }
    });
    csvStream.end();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage(`services.downloadAdResults.DOWNLOAD_FAILED`));
  }
};

export default Router => {
  Router.get('/:campaign', get);
  Router.get('/:campaign/ads', getAds);
  Router.get('/:campaign/results', [
    getCampaignAds.bind(null, 'downloadAdResults', undefined),
    setCsvStream.bind(null, "downloadAdResults", "ad_report"),
    downloadVideoCSV
  ]);
  Router.get('/:campaign/aderrors', [
    getCampaignAds.bind(null, 'downloadAdErrorReport', campaignStatus.CREATION_ERRED),
    setCsvStream.bind(null, "downloadAdErrorReport", "ad_error_report"),
    downloadAdErrorsCSV
  ]);
  Router.get('/:campaign/ad/:ad', getAd);
  return Router;
}