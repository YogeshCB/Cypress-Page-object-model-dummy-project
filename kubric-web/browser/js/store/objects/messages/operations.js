import services from "../../../services";
import userSelectors from '../user/selectors';
import messageActions from './actions';
import selectors from './selectors';

const onMessageClick = ({ id }) => dispatch =>
  services.message.clear()
    .send({
      id
    });

const getSubscriptions = () => dispatch => services.notifications.getSubscriptions().notifyStore().send()
.then(res=> {
  dispatch(messageActions.notificationSubscriptionsFetched(res))
})

const onPreferenceChange = (payload) => dispatch => {
  let preferences = selectors.subscriptions();
  let newPrefs = preferences.map(pref=> {
    if(payload.uid){
      if(pref.uid===payload.uid){
        return {
            ...pref,
            ...payload
        }
      }
      else {
        return pref
      }
    }
  });
  if(newPrefs.length === preferences.length) {
    dispatch(messageActions.notificationPreferenceChange({ payload: newPrefs }));
  }
  services.notifications.triggerSubscription()
      .notifyStore()
      .send({
        subscription_type: "secondary",
        frequency: "instant",
        workspace_id: userSelectors.getWorkspaceId(),
        ...payload
    })
    .then(res=> {
      dispatch(getSubscriptions());
    })
    .catch(err=>{
      dispatch(getSubscriptions());      
    })
  }
export default {
  onMessageClick,
  onPreferenceChange
};
