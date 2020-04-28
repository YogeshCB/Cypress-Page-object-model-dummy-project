import Workflow from '../../lib/job';
import config from 'config';
import manualQC from './tasks/manualqc';

const app = config.get('app');

const job = new Workflow({
  app,
  type: 'ManualQCStatusUpdater',
  numWorkers: 20,
  tasks: [{
    id: 'manual_qc',
  }],
});

job.on('manual_qc', manualQC);

export default job;