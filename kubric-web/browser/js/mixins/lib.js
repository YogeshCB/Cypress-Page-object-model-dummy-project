import { h, Component } from 'preact';
import { at, isFunction } from "@bit/kubric.utils.common.lodash";

export default ({ prefetcher, contextProvider: ContextProvider, fetcher = {} }) => {
  const { data: globalFetcherDataPaths = [] } = fetcher;
  ContextProvider = ContextProvider || Component;
  const checkPrefetched = !!prefetcher;
  const { isFetched: isPrefetched, clearFetched: clearPrefetched, getFetched: getPrefetched } = prefetcher;
  return (config = {}) => {
    const {
      objects, object,
      component: ComponentToMix,
      fetcher = {},
      loadingComponent = <span/>,
      onErred: globalOnErred,
      onFetched: globalOnFetched,
      onFetching: globalOnFetching
    } = config;
    return class DataFetcher extends ContextProvider {

      constructor(props) {
        super(props);
        this.state = {
          loaded: false,
        }
      }

      dataFetchedHandler(response) {
        setImmediate(globalOnFetched, response);
        this.setState({
          loaded: true,
        });
        return response;
      }

      singleResponseHandler(objectName, response) {
        const {
          onFetched
        } = this.fetchConfigs[objectName];
        isFunction(onFetched) && setImmediate(onFetched, response);
        return {
          [objectName]: response,
        };
      }

      static errorHandler(err) {
        isFunction(globalOnErred) && setImmediate(globalOnErred, err);
      }

      resolveGlobalFetcherData() {
        return globalFetcherDataPaths.reduce((acc, path) => {
          const [data] = at(this, path, {});
          return {
            ...acc,
            ...data
          };
        }, {});
      }

      componentWillMount() {
        if (typeof object !== 'string' && typeof objects === 'undefined') {
          throw new Error("Either 'object' or 'objects' is mandatory. Please provide a valid value for one of them");
        } else {
          let fetchConfigs = objects;
          if (typeof fetchConfigs === 'undefined') {
            fetchConfigs = {
              [object]: fetcher,
            };
          }
          this.fetchConfigs = fetchConfigs;
          const promises = Object.keys(fetchConfigs)
            .map(objectName => {
              const { service, shouldAvoidFetching, onFetching, fetcherData, onFetched, fetchedAction, onErred, errorAction, path } = fetchConfigs[objectName];
              if (checkPrefetched && objectName && isPrefetched(objectName)) {
                let data = getPrefetched(objectName);
                clearPrefetched(objectName);
                return this.singleResponseHandler(objectName, data);
              } else {
                if (!shouldAvoidFetching || !shouldAvoidFetching()) {
                  isFunction(onFetching) && setImmediate(onFetching);
                  let fetcherPromise = service;
                  const globalFetcherData = this.resolveGlobalFetcherData();
                  if (Array.isArray(service)) {
                    fetcherPromise = Promise.all(service.map(serv => serv({
                      ...globalFetcherData,
                      ...fetcherData,
                    })));
                  } else {
                    fetcherPromise = service({
                      ...globalFetcherData,
                      ...fetcherData,
                    });
                  }
                  return fetcherPromise
                    .then(this.singleResponseHandler.bind(this, objectName))
                    .catch(ex => {
                      console.log(ex);
                      isFunction(onErred) && setImmediate(onErred, ex);
                      throw ex;
                    });
                }
              }
            });
          setImmediate(globalOnFetching);
          Promise.all(promises)
            .then(responses => {
              return responses.reduce((acc, resp) => {
                acc = {
                  ...acc,
                  ...resp,
                };
                return acc;
              });
            })
            .then(::this.dataFetchedHandler)
            .catch(DataFetcher.errorHandler);
        }
      }

      render() {
        return !this.state.loaded ? loadingComponent : <ComponentToMix {...this.props}/>;
      }
    }
  };
}