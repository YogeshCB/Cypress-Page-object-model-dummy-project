import Express from 'express';
import services from "../../../../services/index";
import oAuthRouter from './oauth';
import { serviceHelper } from "../../../utils";
import moment from 'moment-timezone';
import { updateProfile } from "../../wares";
import messages from '../../../../lib/messages';
import logger from '../../../../lib/logger';

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
    services.shutterstock.updateFolders().send({
      ...req._sessionData,
    })
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
    res.status(500).send(messages.getResponseMessage('services.shutterstock.GET_ACCOUNT_FAILED'));
  }
});

Router.post('/folders', (req, res) => {
  serviceHelper(res, {
    resource: 'shutterstock',
    service: 'updateFolders',
    data: {
      ...req._sessionData,
      ...req.body,
    },
    transformer: foldersTransformer,
  });
});


Router.post('/license-asset', (req, res) => {
  serviceHelper(res, {
    resource: 'shutterstock',
    service: 'licenseAsset',
    data: {
      ...req._sessionData,
      ...req.body,
    },
  });
});

Router.get('/search', (req, res) => {
  serviceHelper(res, {
    resource: 'shutterstock',
    service: 'getAssets',
    data: {
      ...req._sessionData,
      ...req.params
    },
  });
});

Router.get('/list-subscriptions', (req, res) => {
  serviceHelper(res, {
    resource: 'shutterstock',
    service: 'getSubscriptions',
    data: {
      ...req._sessionData,
      ...req.body,
      user_id: req._sessionData.email,
    }
  });
});

Router.delete('/', [async (req, res, next) => {
  try {
    await services.shutterstock.disconnect().send({
      ...req._sessionData,
    });
    next();
  } catch (ex) {
    logger.error(ex);
    res.status(500).send(messages.getResponseMessage('services.shutterstock.DISCONNECT_FAILED'));
  }
}, updateProfile('asset', 'shutterstock', undefined, (req, res, ex) => {
  logger.error(ex);
  res.status(500).send(messages.getResponseMessage('services.shutterstock.DISCONNECT_FAILED'));
}), (req, res) => res.status(200).send()]);

export default Router;