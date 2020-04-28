import config from '../../browser/js/config/index';
import Resolver from '@bit/kubric.utils.common.json-resolver';
import { validateFirebaseKey } from "@bit/kubric.queue.firebase.utils"

const resolver = new Resolver();

const mentionPath = config.chat.fbPaths.mentions;

export const getMentionPath = (channelId, user) => resolver.resolve(mentionPath, {
  channelId,
  user: validateFirebaseKey(user)
});