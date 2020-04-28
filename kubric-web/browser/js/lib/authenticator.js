import { Firebase } from './firebase';

export function logout() {
  Firebase.getProdApp().auth().signOut();
}
