export class Firebase {
  static firebase;
  static initialized = false;
  static initializingPromise = false;

  static init(kubricConfig) {
    if (!Firebase.initialized && !Firebase.initializingPromise) {
      Firebase.initializingPromise = Promise.all([
          import(/* webpackChunkName: "firebase" */ 'firebase/app'),
          import(/* webpackChunkName: "firebase" */ 'firebase/auth'),
          import(/* webpackChunkName: "firebase" */ 'firebase/database'),
          import(/* webpackChunkName: "firebase" */ 'firebase/firestore'),
        ])
        .then(([firebase]) => {
          if (firebase.apps.length === 0) {
            firebase.initializeApp(!kubricConfig ? __kubric_config__.queueAuth : kubricConfig.queueAuth);
          }
          Firebase.firebase = firebase;
          Firebase.prodApp = !kubricConfig ? firebase.initializeApp(__kubric_config__.auth, "authApp") : firebase.initializeApp(kubricConfig.auth, "authApp");
          Firebase.initialized = true;
          Firebase.initializing = false;
          return firebase;
        });
    }
    return Firebase.initializingPromise;
  }

  static getInstance() {
    if (Firebase.initialized) {
      return Firebase.firebase;
    } else {
      throw new Error("Firebase not initialized");
    }
  }

  static getProdApp() {
    if (Firebase.initialized) {
      return Firebase.prodApp;
    } else {
      throw new Error("Firebase not initialized");
    }
  }
}