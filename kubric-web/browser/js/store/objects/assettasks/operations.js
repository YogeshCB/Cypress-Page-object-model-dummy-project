import { Firebase } from '../../../lib/firebase';
import assetActions from '../assets/actions';

const fetchAssetImageFilters = () => dispatch => {
  Firebase.init()
    .then(firebase => {
      const db = firebase.database();

      const ref = db.ref('config/assets/transforms/filters');

      ref.on('value', snapshot => {
        if (snapshot.val() !== null) {
          dispatch(assetActions.saveFilters(snapshot.val()));
        }
        ref.on('child_changed', (snapshot) => {
          dispatch(assetActions.saveFilters(snapshot.val()));
        })
      });
    });
};

export default {
  fetchAssetImageFilters
}