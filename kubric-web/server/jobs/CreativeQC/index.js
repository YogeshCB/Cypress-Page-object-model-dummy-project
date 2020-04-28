import services from '../../services';
import qcJob from './job';
import logger from "../../lib/logger";
import _ from 'lodash';
import config from 'config';

const ADS_FETCH_LIMIT = config.get('fetchLimits.objects.ads');

export default class QCJobsGenerator {
  constructor({ campaignId, email, userid, token, workspace, adStatus } = {}) {
    this.campaignId = campaignId;
    this.token = token;
    this.promises = [];
    this.email = email;
    this.adStatus = adStatus;
    this.workspace = workspace;
  }

  static createQCJob(campaignId, { email, token, workspace }, ad) {
    return qcJob.add({
        campaignId,
        ad,
        user: email,
        email,
        token: token,
        workspace
      }, {
        indexField: 'campaign',
        indexId: campaignId,
      })
      .then(({ id }) => {
        return services.campaign.saveAd()
          .send({
            workspace_id: workspace,
            campaign: campaignId,
            id: ad.uid,
            token,
            qcStatus: "pending",
            tasks: {
              ...ad.tasks,
              creativeQc: id,
            },
          });
      })
      .catch(ex => {
        logger.error('Error while adding QC jobs');
        logger.error(ex);
      });
  }

  createQCJobs(campaignAds) {
    return Promise.all(campaignAds.map(QCJobsGenerator.createQCJob.bind(QCJobsGenerator, this.campaignId, {
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
    return services.campaign.getAds()
      .send(serviceData)
      .then(({ data: campaignAds, next: start }) => {
        if (campaignAds.length === 0) {
          logger.info(`No campaign ads found for the campaign ${this.campaignId} in the status ${this.adStatus}`);
          return true;
        } else {
          this.promises.push(this.createQCJobs(campaignAds));
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