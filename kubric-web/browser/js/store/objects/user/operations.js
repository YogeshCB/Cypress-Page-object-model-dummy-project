import { logout } from "../../../lib/authenticator";
import services from "../../../services";
import { getCurrentRoot } from "../../../lib/utils";

const onLogout = () => dispatch => {
  logout();
  return services.user.logout()
    .notifyStore()
    .send()
    .then(() => {
      window.location.href = getCurrentRoot();
    });
};

export default {
  onLogout,
}