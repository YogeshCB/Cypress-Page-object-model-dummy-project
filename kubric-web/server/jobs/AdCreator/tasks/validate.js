import logger from '../../../lib/logger';
import services from "../../../services";
import { updateProgress } from "./setup";
import { taskPoll } from "../../utils";

const getStatsUpdater = progress => {
  const progressUpdater = updateProgress(progress);
  let previousErred = 0, previousDone = 0;
  const updater = (stats, { processed = 0, failed = 0 } = {}) => {
    stats = progressUpdater(stats, {
      incrementBy: processed - previousDone
    });
    stats = progressUpdater(stats, {
      prop: 'erred.validation',
      incrementBy: failed - previousErred,
      avoidDone: true
    });
    previousDone = processed;
    previousErred = failed;
    return stats;
  };
  updater.flush = ::progressUpdater.flush;
  updater.cancel = ::progressUpdater.cancel;
  return updater;
};

export const taskPoller = (data, progress, resolve, reject, adUpdater, taskId) => {
  let { token, workspace, _progressStats: stats = {} } = data;
  let runningStats = {
    ...stats,
  };
  const progressUpdater = getStatsUpdater(progress);
  const emitter = taskPoll({
    token,
    workspace_id: workspace,
    taskId
  }, async (emitter, task) => {
    let { status, result } = task;
    result = result || {};
    const { data: taskData = [] } = result;
    if (status === -1) {
      emitter.clear();
      reject("Task polling failed");
    } else if (status === 1) {
      emitter.clear();
      runningStats = progressUpdater(runningStats, result);
      const parsedSSRows = adUpdater(taskData, data);
      resolve({
        ssRows: JSON.stringify(parsedSSRows)
      });
    } else if (status === 0) {
      runningStats = progressUpdater(runningStats, result);
    }
  }, () => {
    progressUpdater.flush();
    reject();
  });
  const _clearFn = ::emitter.clear;
  emitter.clear = () => {
    _clearFn();
    progressUpdater.flush();
  };
  return emitter;
};

export const getOrgData = (ssRows = [], avoidParams = true) =>
  ssRows.map(({ orgData = [] }) => orgData
    .reduce((acc, { name, value } = {}) => {
      if (!avoidParams || !/^s(?:\d+)\//.test(name)) {
        acc[name] = value;
      }
      return acc;
    }, {}));

export default async (data, progress, resolve, reject) => {
  try {
    let { token, ssData = "[]", workspace, preprocess = false } = data;
    let ssRows = JSON.parse(ssData);
    if (!preprocess) {
      resolve();
    } else {
      const orgData = getOrgData(ssRows);
      const { task_id: taskId } = await services.qc.sheetVerification()
        .send({
          token,
          workspace_id: workspace,
          data: orgData,
        });

      const adUpdater = (data, { ssData = '[]' } = {}) => {
        const ssRows = JSON.parse(ssData);
        data.forEach(errorObj => {
          const { rows, ...errData } = errorObj;
          return rows.forEach(rowIndex => {
            const arrIndex = rowIndex - 1;
            const { validationErrors = [], ...restRow } = ssRows[arrIndex];
            ssRows[arrIndex] = {
              ...restRow,
              validationErrors: [
                ...validationErrors,
                errData
              ]
            };
          });
        });
        return ssRows;
      };

      taskPoller(data, progress, resolve, reject, adUpdater, taskId);
    }
  } catch (ex) {
    logger.error(ex);
    reject(ex);
  }
}