import { isUndefined } from "@bit/kubric.utils.common.lodash";

export class WorkerManager {
	static workers = {};

	static init(id, Worker) {
		if (isUndefined(WorkerManager.workers[id])) {
			WorkerManager.workers[id] = { id, workerObject: new Worker() };
		}
		return WorkerManager.workers[id].workerObject;
	}

	static getAllWorkers() {
		return WorkerManager.workers;
	}

	static terminate(id) {
		if (WorkerManager.workers[id] !== undefined) {
			WorkerManager.workers[id].workerObject.terminate();
			delete WorkerManager.workers[id];
		}
	}
}
