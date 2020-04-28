import Express from 'express';
import services from "../../../../services";
import oAuthRouter from './oauth';
import { serviceHelper } from "../../../utils";
import moment from 'moment-timezone';
import { updateProfile } from "../../wares";
import logger from '../../../../lib/logger';
import messages from '../../../../lib/messages';

const Router = Express.Router();

Router.use('/oauth', oAuthRouter);

const foldersTransformer = ({ folder_selection: selectedFolders = {} } = {}) => {
  const { last_updated: lastSynced, folders = [] } = selectedFolders;
  return {
    folders,
    lastSynced: moment(lastSynced).tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm a'),
  }
};

Router.get('/account', async (req, res, next) => {
  const promises = [
    services.drive.getCredentials().send({
      ...req._sessionData,
    }),
    services.drive.getFolders().send({
      ...req._sessionData,
    }),
  ];
  try {
    const results = await Promise.all(promises);
    const [user = {}, folderResponse] = results;
    res.status(200).send({
      ...user,
      ...foldersTransformer(folderResponse),
    });
  } catch (ex) {
    logger.error(ex);
    if (ex.status === 404) {
      res.status(200).send({
        ...req._sessionData,
        ...foldersTransformer({
          "folder_selection": {
            "folders": [],
          },
        }),
      })
    }
    res.status(500).send(messages.getResponseMessage('services.drive.GET_ACCOUNT_FAILED'));
  }
});

Router.put('/folders', (req, res) => {
  serviceHelper(res, {
    resource: 'drive',
    service: 'updateFolders',
    data: {
      ...req._sessionData,
      ...req.body,
    },
    transformer: foldersTransformer,
  });
});

Router.delete('/', [async (req, res, next) => {
  try {
    await services.drive.disconnect().send({
      ...req._sessionData,
    });
    next();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.drive.DISCONNECT_FAILED'));
  }
}, updateProfile('asset', 'drive', undefined, (req, res, ex) => {
  logger.error(ex);
  res.status(500).send(messages.getResponseMessage('services.drive.DISCONNECT_FAILED'));
}), (req, res) => res.status(200).send()]);

export default Router;