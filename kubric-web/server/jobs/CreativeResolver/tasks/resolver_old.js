import services from '../../../services';
import logger from '../../../lib/logger';
import { resolveBindings } from "../../../api/resolver";
import { campaignStatus } from "../../../../isomorphic/constants/queue";

const extractFromParameters = (resolutionResults = {}, field) => resolutionResults.map(result => result[field] || {});

export default async (data, progress, resolve, reject) => {
  let { token, segmentData = [], campaign_id, workspace, shots = [], bindings, email, mediaFormat = "video" } = data;
  const totalSegments = segmentData.length;
  if (totalSegments > 0) {
    for (let i = 0; i < segmentData.length; i++) {
      try {
        let json = {
          token,
          ...segmentData[i],
        };
        if (campaign_id) {
          json = {
            ...json,
            campaign_id
          }
        }
        const { data: segment } = await services.segments.save().send(json);
        const { hasErred, results: resolutionResults } = await resolveBindings(bindings, segment, email, token, workspace);
        const status = !hasErred ? campaignStatus.CREATION_COMPLETED : campaignStatus.CREATION_ERRED;
        let meta = {
          assets: extractFromParameters(resolutionResults, 'meta')
        };
        if (hasErred) {
          meta = {
            ...meta,
            message: "Asset resolution failed",
            errors: extractFromParameters(resolutionResults, 'errors')
          };
        }
        await services.campaign.saveAd().send({
          token,
          campaign: campaign_id,
          workspace_id: workspace,
          status,
          mediaFormat,
          source: {
            templates: shots,
            parameters: extractFromParameters(resolutionResults, 'results'),
            segment
          },
          meta,
        });
        const completed = i + 1;
        if (completed === totalSegments) {
          resolve({
            progress: 100,
          });
        }
        progress(parseInt((completed * 100) / totalSegments));
      } catch (ex) {
        logger.error(ex);
        reject(ex.message);
      }
    }
  } else {
    progress(100)
      .then(res => resolve({
        ...data,
        progress: 100,
      }))
      .catch(err => reject(err.message));
  }
}