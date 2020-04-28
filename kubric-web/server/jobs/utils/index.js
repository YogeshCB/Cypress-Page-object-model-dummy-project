import config from "config";
import _ from "lodash";
import services from "../../services";
import poll from "polling-to-event";
import firestore from "../../lib/firestore";
import Resolver from "@bit/kubric.utils.common.json-resolver";

const resolver = new Resolver();

const ADS_FETCH_LIMIT = config.get('fetchLimits.objects.ads');

export const getAdRef = (campaign, ad) => firestore.doc(resolver.resolve(config.get("firebase.refs.campaigns.ad"), {
  campaign,
  ad
}));

const getIterator = (fn, serviceData = {}, handler, {
  callInBatches = false,
  avoidPagination = false,
  waitForBatch = false
} = {}) => {
  /**
   * Recursive function called for every batch fetched
   * @param promises
   * @param results
   * @param start
   * @returns {*}
   */
  const iterator = ({ promises = [], results = [], start } = {}) => {
    /**
     * Initiates handler for a set of results based on whether it needs to be called in batches
     * or one by one. Pushes promises into the promises array
     */
    const initiateHandler = creatives => {
      if (typeof handler === 'function') {
        if (callInBatches) {
          const promise = handler(creatives);
          promises.push(promise);
          return promise;
        } else {
          const localPromises = [];
          creatives.reduce((acc, creative) => {
            const promise = handler(creative);
            acc.push(promise);
            localPromises.push(promise);
            return acc;
          }, promises);
          return localPromises;
        }
      }
    };

    const [method] = _.at(services, fn);
    return method()
      .send({
        ...serviceData,
        start: avoidPagination ? undefined : start
      })
      .then(({ data = [], next: start }) => {
        results.push(...data);
        let batchPromises = initiateHandler(data);
        batchPromises = waitForBatch ? batchPromises : [];
        return Promise.all(batchPromises)
          .then(() => {
            if (!_.isUndefined(start)) {
              return iterator({
                promises,
                results,
                start
              });
            } else {
              return Promise.all(promises);
            }
          });
      });
  };

  return iterator();
};

export const creativeIterator = ({ workspace, campaignId, token, limit = ADS_FETCH_LIMIT, adStatus, qcStatus } = {}, handler, options) => {
  const serviceData = {
    campaign: campaignId,
    token,
    limit,
    workspace_id: workspace,
  };
  if (!_.isUndefined(adStatus)) {
    serviceData.status = adStatus;
  }
  if (!_.isUndefined(qcStatus)) {
    serviceData.qcStatus = qcStatus;
  }
  return getIterator("campaign.getAds", serviceData, handler, options);
};


export const taskPoll = ({ token, taskId } = {}, pollHandler, reject) => {
  const pollEmitter = poll(async done => {
    try {
      let response = await services.qc.getTaskStatus()
        .send({
          token,
          taskId
        });
      done(null, response);
    } catch (ex) {
      done(ex);
    }
  }, {
    interval: 2000, //polled every 2 secs
    longpolling: true,  //emits the 'longpoll' event when last poll data differs from the one before that
  });
  pollEmitter.on('longpoll', pollHandler.bind(null, pollEmitter));
  pollEmitter.on('error', err => {
    pollEmitter.clear();
    reject(err);
  });
  return pollEmitter;
};
