import Workflow from '@bit/kubric.queue.firebase.workflow';
import config from 'config';

Workflow.initialize({
  firebase: config.get('firebase'),
});

export default Workflow;