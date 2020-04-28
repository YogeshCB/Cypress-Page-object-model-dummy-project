import services from '../../services';
import videoJob from './job';
import logger from "../../lib/logger";
import { campaignStatus } from "../../../isomorphic/constants/queue";
import _ from 'lodash';
import config from 'config';

const ADS_FETCH_LIMIT = config.get('fetchLimits.objects.ads');

export default class CreativeJobGenerator {
  constructor({ campaignId, email, token, workspace, adStatus, qcStatus } = {}) {
    this.campaignId = campaignId;
    this.token = token;
    this.promises = [];
    this.email = email;
    this.adStatus = adStatus;
    this.qcStatus = qcStatus;
    this.workspace = workspace;
  }

  static createVideoJob(campaignId, { email, token, workspace }, ad) {
    return videoJob.add({
        campaignId,
        ad,
        user: email,
        email,
        token,
        workspace
      }, {
        indexField: 'campaign',
        indexId: campaignId,
      })
      .then(({ id }) => {
        return services.campaign.saveAd().send({
          workspace_id: workspace,
          campaign: campaignId,
          id: ad.uid,
          token,
          status: campaignStatus.GENERATION_PENDING,
          tasks: {
            ...ad.tasks,
            videogeneration: id,
          },
        });
      })
      .catch(ex => {
        logger.error('Error while adding video jobs');
        logger.error(ex);
      });
  }

  createVideoJobs(campaignAds) {
    return Promise.all(campaignAds.map(CreativeJobGenerator.createVideoJob.bind(CreativeJobGenerator, this.campaignId, {
      email: this.email,
      token: this.token,
      workspace: this.workspace
    })));
  }

  generate(start) {
    const serviceData = {
      campaign: this.campaignId,
      token: this.token,
      limit: ADS_FETCH_LIMIT,
      workspace_id: this.workspace,
      start,
    };
    if (!_.isUndefined(this.adStatus)) {
      serviceData.status = this.adStatus;
    }
    if (!_.isUndefined(this.qcStatus)) {
      serviceData.qcStatus = this.qcStatus;
    }
    return services.campaign.getAds().send(serviceData)
      .then(({ data: campaignAds, next: start }) => {
        if (campaignAds.length === 0) {
          logger.info(`No campaign ads found for the campaign ${this.campaignId} in the status ${this.adStatus}`);
          return true;
        } else {
          this.promises.push(this.createVideoJobs(campaignAds));
          if (typeof start !== 'undefined') {
            return this.generate(start);
          } else {
            return Promise.all(this.promises)
              .catch(ex => {
                logger.error('Error while creating publish jobs');
                logger.error(ex);
              });
          }
        }
      });
  }
}