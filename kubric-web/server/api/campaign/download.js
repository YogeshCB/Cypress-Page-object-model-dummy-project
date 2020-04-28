import logger from '../../lib/logger';
import messages from '../../lib/messages';
import services from '../../services';
import csv from 'fast-csv';
import { creativeIterator } from "../../jobs/utils";
import _ from 'lodash';

const download = async (req, res) => {
  try {
    const { campaign } = req.params;
    const { email } = req._sessionData;
    const isKubricUser = /@kubric\.io$/.test(email);
    const fileName = `${campaign}_creatives_${Date.now()}.csv`;
    const csvStream = csv.createWriteStream({ headers: true });
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${fileName}`
    });
    csvStream.pipe(res);
    await creativeIterator({
      workspace: req._sessionData.workspace_id,
      token: req._sessionData.token,
      campaignId: campaign
    }, creative => {
      const [segment] = _.at(creative, 'source.segment');
      const [orgData = {}] = _.at(creative, 'source.orgData');
      const { aud_id, name, attributes = [] } = segment;
      let csvData = {
        aud_id,
        name,
      };
      if (!isKubricUser) {
        csvData = orgData.reduce((acc, { name, value }) => {
          acc[name] = value;
          return acc;
        }, csvData);
      } else {
        csvData = attributes.reduce((acc, { name, value } = {}) => {
          acc[name] = value;
          return acc;
        }, csvData);
      }
      csvStream.write(csvData);
    });
    csvStream.end();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.campaign.CREATIVES_DOWNLOAD_FAILED'));
  }
};

export default Router => {
  Router.get('/:campaign/download', download);
  return Router;
}