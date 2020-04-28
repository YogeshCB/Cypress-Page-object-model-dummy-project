import Workflow from '../../lib/job';
import config from 'config';
import creativeResolver from './tasks/resolver';

const app = config.get('app');

const job = new Workflow({
  app,
  type: 'CreativeResolver',
  numWorkers: 2,
  tasks: [{
    id: 'resolve_creatives',
  }],
});

job.on('resolve_creatives', creativeResolver);

export default job;