import { h } from 'preact';
import Profile from './profile/index';
import errorMessages from './profile/errors';
import DataFetcher, { getFetcherHandlers, getServiceHandler } from '../mixins/DataFetcher';
import profileOperations from "../store/objects/profile/operations";
import assetOperations from "../store/objects/assets/operations";
import profileActions from "../store/objects/profile/actions";
import { connect } from 'preact-redux';
import services from '../services';
import store from '../store';
import { PrimaryButton } from "../components/commons/misc";
import uploadSelectors from "../store/objects/uploads/selectors";
import notificationActions from "../store/objects/notifications/actions";
import routeSelectors from "../store/objects/route/selectors";
import teamOperations from '../store/objects/team/operations';

const ProfileComponent = connect(state => {
  const profile = state.profile;
  return ({
    ...profile,
    uploadTask: uploadSelectors.getTaskById(profile.account.uploadJob, state),
  });
}, {
  ...assetOperations,
  ...profileOperations,
  ...teamOperations
})(DataFetcher({
  object: 'profile',
  component: Profile,
  objects: {
    profile: {
      service: getServiceHandler(services.user.getProfile),
      ...getFetcherHandlers(profileActions.profileFetched, {
        postFetched(res) {
          const { network, tab, section } = routeSelectors.getPageQuery();
          if ((+section) === 0) {
            store.dispatch(profileActions.currentAssetChange(-1));
            setTimeout(() => store.dispatch(profileOperations.onOpenNetwork('publisher', +tab, network), 50));
          } else if ((+section) === 1) {
            store.dispatch(profileActions.currentPublisherChange(-1));
            setTimeout(() => store.dispatch(profileOperations.onOpenNetwork('asset', +tab, network), 50));
          }
        }
      }),
    },
    integrations: {
      service: getServiceHandler(services.user.getIntegrations),
      ...getFetcherHandlers(profileActions.integrationsFetched)
    }
  },
}));

export const routeWillLoad = ({ params = {}, query = {} }) => {
  let { error } = query;
  if (typeof error !== 'undefined') {
    if (errorMessages[error]) {
      store.dispatch(notificationActions.addNotification(errorMessages[error]));
    }
  }
  return {
    component: ProfileComponent,
    pageData: {
      pageActions: [<PrimaryButton
        onClick={() => store.dispatch(profileOperations.saveProfile())}>SAVE</PrimaryButton>],
    },
  };
};