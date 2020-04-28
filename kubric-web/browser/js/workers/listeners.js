import store from "../store";
import routeTypes from "../store/objects/route/types";
import userSelectors from "../store/objects/user/selectors";
import { ASSET_ROUTE, ASSETS_ROUTE, CAMPAIGNS_ROUTE, CREATED_CAMPAIGN_ROUTE } from "../routes";
import { setWorkspace } from "../store/objects/servicetypes";
import routeSelectors from "../store/objects/route/selectors";
import { WorkerManager } from "./WorkerManager";
import AssetTasksWorker from "./assetTasks.worker";
import { WorkerConstants } from "./constants";

export const assettaskworker = () => {
	if (!userSelectors.isWorkspaceSet()) {
		return;
	}
	const routeId = routeSelectors.getRouteId();
	if (routeId === ASSET_ROUTE || routeId === ASSETS_ROUTE || routeId === CAMPAIGNS_ROUTE || routeId === CREATED_CAMPAIGN_ROUTE) {
		const assetTasksWorker = WorkerManager.init("assettasksworker", AssetTasksWorker);
		const email = userSelectors.getUserEmail();
		const workspaceId = userSelectors.getWorkspaceId();

		assetTasksWorker.postMessage({
			event: WorkerConstants.WORKER_START,
			data: { kubricConfig: __kubric_config__, email: email, workspaceId: workspaceId }
		});

		assetTasksWorker.addEventListener(
			"message",
			e => {
				const message = e.data;
				const { type, data: payload } = message;
				switch (type) {
					case WorkerConstants.DISPATCH_ACTION:
						store.dispatch(payload);
						break;
				}
			},
			false
		);

		return {
			types: [setWorkspace.INITIATED, routeTypes.ROUTE_LOADED],
			handler: () => {
				WorkerManager.terminate("assettasksworker");
			}
		};
	}
};
