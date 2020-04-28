import AuthProvider from './provider';
import { signup } from "../utils";
import addNotification from "../../notifier";

export default class Google extends AuthProvider {
  async login() {
    const firebase = await this.getFirebaseInstance();
    const provider = new firebase.auth.GoogleAuthProvider();
    const user = await super.getCurrentUser();
    if (user) {
      return {
        user,
      };
    } else {
      return await firebase.auth().signInWithPopup(provider);
    }
  }

  async signup() {
    const data = await this.login();
    const resp = await signup(data);
    addNotification('Your request for access to Kubric has been received and is under process.');
    return resp;
  }
}