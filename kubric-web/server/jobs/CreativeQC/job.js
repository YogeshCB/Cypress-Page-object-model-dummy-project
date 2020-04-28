import Workflow from '../../lib/job';
import config from 'config';
import preGenerationQC from './tasks/pregenqc';

const app = config.get('app');

const job = new Workflow({
  app,
  type: 'CreativeQualityChecker',
  numWorkers: 20,
  tasks: [{
    id: 'pregen_qc',
  }],
});

job.on('pregen_qc', preGenerationQC);

export default job;