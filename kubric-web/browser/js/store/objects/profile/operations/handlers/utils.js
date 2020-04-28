import config from "../../../../../config";
import services from '../../../../../services';

export const publisherOAuthFlow = (channel, dispatch) =>
  services.publisher.getUrl()
    .notifyStore()
    .send({
      channel,
      redirect: config.publisher.oauthRedirect[channel],
    })
    .then(({ oauthUrl }) => {
      location.href = oauthUrl
    });
