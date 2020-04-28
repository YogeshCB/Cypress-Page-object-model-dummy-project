import firebase from 'firebase';
import firebaseAuth from 'firebase/auth';
import config from 'config';

const firebaseConf = config.get('firebase.config');

export default firebase.initializeApp(firebaseConf);
