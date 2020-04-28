import _ from 'lodash';
import admin from "firebase-admin";
import config from "config";

const serviceAccount = config.get("firebase.serviceAccount");
const databaseURL = config.get("firebase.config.databaseURL");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
});

const db = admin.database();
const getKey = snapshot => _.isFunction(snapshot.key) ? snapshot.key() : snapshot.key;

const increment = fieldName => {
  let startTime = Date.now();
  db.ref(`queue/apps/kubric/AdsCreationJob/tasks/-LhFT6cm4mMVuXvZ_hRG`).transaction(task => {
    if (!_.isNull(task)) {
      // console.info(`Non null received: ${JSON.stringify(task)}`);
      task.test[fieldName] = task.test[fieldName] + 1;
    }
    return task;
  }, (error, committed, snapshot) => {
    /* istanbul ignore if */
    if (error) {
      console.info("Increment transaction errored", error);
    } else if (committed && snapshot.exists()) {
      let endTime = Date.now();
      console.info("Increment done", getKey(snapshot));
      console.info(`Transaction time: ${(endTime - startTime) / 1000}secs`);
    }
  }, true);
};

const incrementOptimize = fieldName => {
  let startTime = Date.now();
  db.ref(`queue/apps/kubric/AdsCreationJob/tasks/-LhFT6cm4mMVuXvZ_hRG/test/${fieldName}`).transaction(count => {
    if (!_.isNull(count)) {
      console.info(`Non null received: ${count}`);
      return count + 1;
    }
    return count;
  }, (error, committed, snapshot) => {
    /* istanbul ignore if */
    if (error) {
      console.info("Increment transaction errored", error);
    } else if (committed && snapshot.exists()) {
      let endTime = Date.now();
      console.info("Increment done", getKey(snapshot));
      console.info(`Transaction time: ${(endTime - startTime) / 1000}secs`);
    }
  }, false);
};

let count = 1;
while (count <= 100) {
  // incrementOptimize("count1");
  // incrementOptimize("count2");
  increment("count1");
  // increment("count2");
  count++;
}