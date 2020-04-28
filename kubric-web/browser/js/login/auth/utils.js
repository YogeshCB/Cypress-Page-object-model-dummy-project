import { onAuthProcessed } from "../util";
import { postData } from "../../lib/utils";

export const getUserData = user => ({
  userid: user.uid,
  email: user.email,
  name: user.displayName,
  photo: user.photoURL,
  timezone: -(new Date()).getTimezoneOffset(),
});

export const signup = data => new Promise((resolve, reject) => {
  postData('/user/signup', {
    responseHandler: req => {
      if (req.status === 200) {
        onAuthProcessed();
        analytics.track('Sign Up',{email:data.user.email});     
        analytics.identify(data.user.email,{email:data.user.email});        
        resolve();
      } else {
        onAuthProcessed();
        reject({
          status: req.status,
          ...data,
        });
      }
    },
    data: getUserData(data.user),
  });
});