import Workflow from '../../lib/job';
import config from 'config';
import setup from './tasks/setup';
import deleteAds from './tasks/delete';
import preprocess from './tasks/preprocess';
import validate from './tasks/validate';
import adsCreation from './tasks/create';

const app = config.get('app');

const job = new Workflow({
  app,
  type: 'AdsCreationJob',
  numWorkers: 2,
  tasks: [{
    id: 'setup',
  }, {
    id: 'deleteAds',
  }, {
    id: 'validate',
  }, {
    id: 'preprocess',
  }, {
    id: 'adsCreation',
  }],
});

job.on('setup', setup);
job.on('deleteAds', deleteAds);
job.on('preprocess', preprocess);
job.on('validate', validate);
job.on('adsCreation', adsCreation);

export default job;