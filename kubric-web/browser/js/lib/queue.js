import { isFunction } from "@bit/kubric.utils.common.lodash";

const PENDING_STATE = 'pending';
const PROGRESS_STATE = 'inprogress';
const SUCCESS_STATE = 'done';
const ERROR_STATE = 'erred';

export default class Queue {
  constructor({ maxWorkers = 1 } = {}) {
    this.jobs = [];
    this.maxWorkers = maxWorkers;
    this.currentWorkers = 0;
  }

  _workerSpawned() {
    this.currentWorkers++;
  }

  _workerFree() {
    this.currentWorkers--;
  }

  _workersPermitted() {
    return this.maxWorkers - this.currentWorkers;
  }

  add(data) {
    return new Promise((resolve, reject) => {
      const promiseResolver = (status, data) => (status === SUCCESS_STATE ? resolve : reject)(data);
      this.jobs.push({
        status: PENDING_STATE,
        data,
        promiseResolver
      });
      this._tryToDispatch();
    });
  }

  _tryToDispatch() {
    if (!isFunction(this.worker)) {
      throw new Error("No worker function registered");
    }
    const nextPending = () => this.jobs.findIndex(({ status }) => status === PENDING_STATE);
    let nextPendingIndex = nextPending();
    let workersPermitted = this._workersPermitted();
    while (nextPendingIndex > -1 && workersPermitted > 0) {
      this.progress(nextPendingIndex, 0);
      setImmediate(
        this.worker,
        this.jobs[nextPendingIndex].data,
        this.resolve.bind(this, nextPendingIndex),
        this.reject.bind(this, nextPendingIndex),
        this.progress.bind(this, nextPendingIndex),
      );
      this._workerSpawned();
      nextPendingIndex = nextPending();
      workersPermitted = this._workersPermitted();
    }
  }

  updateJob(status, dataField, index, data) {
    const job = this.jobs[index];
    this.jobs[index] = {
      ...job,
      status: status || job.status,
      data: {
        ...job.data,
        [dataField]: data,
      }
    };
  }

  onJobEnded(status, index, data) {
    const { promiseResolver } = this.jobs[index];
    promiseResolver(status, data);
    this._workerFree();
    this._tryToDispatch();
  }

  resolve(index, results) {
    this.updateJob(SUCCESS_STATE, 'results', index, results);
    this.onJobEnded(SUCCESS_STATE, index, results);
  }

  reject(index, error) {
    this.updateJob(ERROR_STATE, 'error', index, error);
    this.onJobEnded(ERROR_STATE, index, results);
  }

  progress(index, progress) {
    this.updateJob(PROGRESS_STATE, 'progress', index, progress);
  }

  registerWorker(worker) {
    this.worker = worker;
  }
}