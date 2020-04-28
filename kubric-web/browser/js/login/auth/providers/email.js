import AuthProvider from './provider';
import addNotification from "../../notifier";
import { onAuthProcessed } from "../../util";
import { signup } from "../utils";

export default class EmailPassword extends AuthProvider {
  constructor({ email, password } = {}) {
    super();
    this.email = email;
    this.password = password;
  }

  async authenticate(fnName) {
    const firebase = await this.getFirebaseInstance();
    const user = await firebase.auth()[fnName](this.email, this.password);
    return {
      user
    };
  }

  async login() {
    const data = await this.authenticate('signInWithEmailAndPassword');
    if (data.user.emailVerified) {
      return data;
    } else {
      throw new Error(`Please verify your email(${data.user.email}) before attempting to login.`);
    }
  }

  async signup() {
    try {
      await signup({
        user: {
          email: this.email
        }
      });
      const data = await this.authenticate('createUserWithEmailAndPassword');
      const firebase = await this.getFirebaseInstance();
      await firebase.auth().currentUser.sendEmailVerification({
        url: `${__kubric_config__.root}?email=${data.user.email}`,
      });
      addNotification(`We have sent an email to ${data.user.email}. Please click on the link provided an verify your email.`);
      onAuthProcessed();
      return data;
    } catch (err) {
      console.log(err);
      if (err.status === 409) {
        addNotification(`${this.email} is already a member of Kubric. Please proceed to login.`, 'error');
      }
    }
  }
}
