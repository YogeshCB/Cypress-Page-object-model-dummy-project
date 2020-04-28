import { Firebase, firebaseContants } from "../lib/firebase";
import assettaskActions from "../store/objects/assettasks/actions";
import { WorkerConstants } from "./constants";

onmessage = e => {
	switch (e.data.event) {
		case WorkerConstants.WORKER_START:
			const { kubricConfig, email, workspaceId } = e.data.data;

			Firebase.init(kubricConfig).then(() => {
				const firebase = Firebase.getProdApp();
				const db = firebase.firestore();
				const tasksRef = db.collection(`asset_tasks/${workspaceId}/${email.replace(/\./g, ",")}`);
				const queryRef = tasksRef.where("status", "<", 100);

				queryRef.onSnapshot(
					querySnapshot => {
						querySnapshot.docChanges.forEach(change => {
							const payload = change.doc.data();
							if (change.type === "added") {
								postMessage({ data: assettaskActions.saveChildData(payload), type: WorkerConstants.DISPATCH_ACTION });
							}
							if (change.type === "modified") {
								postMessage({ data: assettaskActions.saveChildData(payload), type: WorkerConstants.DISPATCH_ACTION });
							}
							if (change.type === "removed") {
								postMessage({
									data: assettaskActions.deleteAssetTask({ id: payload.created_for }),
									type: WorkerConstants.DISPATCH_ACTION
								});
							}
						});
					},
					error => {
						postMessage({ data: error, event: WorkerConstants.WORKER_ERROR });
						console.log(`Assettasks worker encountered error: ${error}`);
					}
				);
			});
			return void postMessage({ data: "Assettasks worker initiated", event: WorkerConstants.WORKER_STARTED });
		default:
			postMessage(e.data);
	}
};
