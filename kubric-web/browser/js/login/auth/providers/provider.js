import { Firebase } from "../../../lib/firebase";

export default class AuthProvider {
  getFirebaseInstance() {
    return Firebase.init();
  }

  async getCurrentUser() {
    const firebase = await this.getFirebaseInstance();
    return firebase.auth().currentUser;
  }
}