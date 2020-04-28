import QueueDB from '@bit/kubric.queue.firebase.db';
import { WFSTATUS_KEYNAME } from '@bit/kubric.queue.firebase.constants'
import { isValidString } from "@bit/kubric.utils.common.lodash";
import { Firebase } from "./firebase";

const jobTypes = {
  adcreation: {
    app: 'kubric',
    jobType: 'AdsCreationJob',
  },
  videogeneration: {
    app: 'kubric',
    jobType: 'CreativeGenerationJob',
  },
  publish: {
    app: 'kubric-publisher',
    jobType: 'FacebookAdJob',
  },
  publishjobcreation: {
    app: 'kubric-publisher',
    jobType: 'PublishJobCreator',
  },
  manualqc: {
    app: "kubric",
    jobType: "ManualQCStatusUpdater"
  }
};

const getTaskData = snapshot => snapshot.val() === null ? {} : ({
  key: snapshot.key,
  ...snapshot.val(),
});

export default class FirebaseQueue {
  static initialized = false;

  static async init() {
    if (!FirebaseQueue.initialized) {
      const queueApp = await Firebase.init();
      QueueDB.initialize({
        firebaseInstance: queueApp,
      });
      FirebaseQueue.initialized = true;
    }
  }

  static checkIfInitialized() {
    if (!FirebaseQueue.initialized) {
      throw new Error("Queue is not initialized!!");
    }
  }

  static getTaskRef(type, task, path = '') {
    FirebaseQueue.checkIfInitialized();
    const { jobType, app } = jobTypes[type];
    let ref = QueueDB.getTaskRef(app, jobType, task);
    if (isValidString(path)) {
      const queueApp = Firebase.getInstance();
      ref = queueApp.database()
        .ref(`${ref.path.toString()}/${path}`);
    }
    return ref;
  }

  static setTaskListener(type, task, listener) {
    FirebaseQueue.checkIfInitialized();
    const taskRef = FirebaseQueue.getTaskRef(type, task);
    const listenerRef = taskRef.on('value', snapshot => {
      const taskData = getTaskData(snapshot);
      const wfStatus = taskData[WFSTATUS_KEYNAME];
      setImmediate(listener, taskData);
      if (wfStatus === 10 || wfStatus === -1) {
        taskRef.off('value', listenerRef);
      }
    });
  }
}