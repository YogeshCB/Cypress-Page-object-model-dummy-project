import createDataFetcher from '@bit/kubric.components.mixins.datafetcher';
import { isPrefetched, clearPrefetched, getPrefetched } from "../lib/utils";
import ContextProvider from "../components/commons/ContextProvider";
import store from '../store';
import spinnerActions from "../store/objects/spinner/actions";
import { isFunction } from '@bit/kubric.utils.common.lodash';

export default createDataFetcher({
  prefetcher: {
    isFetched: isPrefetched,
    clearFetched: clearPrefetched,
    getFetched: getPrefetched
  },
  contextProvider: ContextProvider,
  fetcher: {
    data: ['context.location.params']
  }
});

export const onFetching = () => store.dispatch(spinnerActions.showSpinner());

export const getFetcherHandlers = (fetchedAction, { spinnerEnabled = true, postFetched } = {}) => {
  const handlers = {
    onFetched(res) {
      isFunction(fetchedAction) && store.dispatch(fetchedAction(res));
      spinnerEnabled && store.dispatch(spinnerActions.hideSpinner());
      isFunction(postFetched) && postFetched(res);
    }
  };
  if (spinnerEnabled) {
    handlers.onFetching = onFetching;
  }
  return handlers;
};

export const getServiceHandler = service => data => service().send(data);