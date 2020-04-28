import { serviceHelper } from "../utils";
import { statsPathMap as pathMap } from "../../../isomorphic/constants/creatives";
import _ from 'lodash';

const incrementPath = (count, acc, path) => {
  const currentCount = _.get(acc, path, 0);
  _.set(acc, path, currentCount + count);
  return acc;
};

export const statsTransformer = ({ data = [] }) =>
  data.reduce((acc, { key: status, doc_count: count = 0 }) => {
    acc = incrementPath(count, acc, 'all');
    const statusPaths = pathMap[status];
    if (Array.isArray(statusPaths)) {
      acc = statusPaths.reduce(incrementPath.bind(null, count), acc);
    } else {
      acc = incrementPath(count, acc, statusPaths);
    }
    return acc;
  }, {});

export const assigneeTransformer = (currentUser, { data = [] }) =>
  data.reduce((acc, { key: assignee, doc_count: count = 0 }) => {
    assignee = assignee === currentUser ? 'self' : assignee;
    acc[assignee] = count;
    return acc;
  }, {});


const getStats = (req, res) => {
  serviceHelper(res, {
    resource: 'campaign',
    service: 'getCount',
    data: {
      ...req._sessionData,
      ...req.params,
    },
    transformer: statsTransformer,
  });
};

const getAssignees = (req, res) => {
  serviceHelper(res, {
    resource: 'campaign',
    service: 'getAssignees',
    data: {
      ...req._sessionData,
      ...req.params,
    },
    transformer: assigneeTransformer.bind(null, req._sessionData.email),
  });
};

export default Router => {
  Router.get('/:campaign/creatives/stats', getStats);
  Router.get('/:campaign/creatives/assignees', getAssignees);
  return Router;
};
