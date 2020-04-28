import { Firebase } from "../../../lib/firebase";
import securityActions from "./actions";

function toLocalDate(inDate) {
  var d = new Date(0);
  d.setUTCSeconds(inDate);
  return d;
}

const fetchAllAudits = () => dispatch => {
  Firebase.init()
    .then(() => {
      const firebase = Firebase.getProdApp();
      const db = firebase.database();
      const ref = db.ref(`audit-logs`);

      ref.on("value", snapshot => {
        if (snapshot.val() !== null) {
          const firPayload = snapshot.val();
          let data = [];
          const idList = Object.keys(firPayload).map(key => firPayload[key]);
          idList.map(id => data.push(...Object.keys(id).map(key => id[key])));
          data = data.map(o => ({ ...o, time: String(toLocalDate(o.time)) }));
          dispatch(securityActions.auditsFetched({ data: data }));
        }
      });
    });
};

export default {
  fetchAllAudits
};
