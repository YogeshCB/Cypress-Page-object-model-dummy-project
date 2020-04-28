import Workflow from '../../lib/job';
import config from 'config';
import generateCreative from './tasks/generate';

const app = config.get('app');
const numWorkers = config.get('workerCount.creative');

const job = new Workflow({
  app,
  type: 'CreativeGenerationJob',
  numWorkers,
  timeout: 60 * 60 * 1000,  //1hr
  tasks: [{
    id: 'generate_creative',
  }],
});

job.on('generate_creative', generateCreative);

export default job;