import user from './user/reducer';
import spinner from './spinner/reducer';
import route from './route/reducer';
import uploadtasks from './uploads/reducer';
import campaigns from './campaigns/reducer';
import profile from './profile/reducer';
import picker from './picker/reducer';
import team from './team/reducer';
import workspace from './workspace/reducer';
import assets from './assets/reducers/index';
import assettasks from './assettasks/reducer';
import publisher from './publisher/reducer';
import notifications from './notifications/reducer';
import campaign from './campaign/reducer';
import home from './home/reducer';
import app from './app/reducer';
import zip from './zip/reducer';
import chat from './chat/reducer';
import sourcing from './sourcing/reducer';
import security from './security/reducer';
import messages from './messages/reducer';

export default {
  app,
  campaign,
  chat,
  home,
  publisher,
  picker,
  route,
  user,
  spinner,
  uploadtasks,
  campaigns,
  profile,
  team,
  workspace,
  assets,
  assettasks,
  notifications,
  zip,
  sourcing,
  security,
  messages
};