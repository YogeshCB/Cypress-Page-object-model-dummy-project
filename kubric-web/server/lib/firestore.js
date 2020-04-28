import admin from "firebase-admin";
import config from "config";

let serviceAccount;
try {
  serviceAccount = config.get('firebase.firestoreServiceAccount');
} catch (ex) {
  serviceAccount = config.get("firebase.serviceAccount");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export default db;