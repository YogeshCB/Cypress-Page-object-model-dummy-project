import { h, Component } from 'preact';
import { isObject, mapValues, isFunction } from "@bit/kubric.utils.common.lodash";

export default (ComponentToMix, config = {}, resolvers = {}) =>
  class PropResolver extends Component {
    resolveProp(resolver) {
      if (typeof resolver === 'string' && isFunction(resolvers[resolver])) {
        return resolvers[resolver]();
      } else if (typeof resolver === 'function') {
        return resolver(this.props);
      } else if (isObject(resolver)) {
        const { resolver: resolverId, params = [] } = resolver;
        if (isFunction(resolvers[resolverId])) {
          return resolvers[resolverId](...params.map(param => isFunction(param) ? param() : param))
        }
      }
    }

    resolveProps() {
      return mapValues(config, ::this.resolveProp);
    }

    render() {
      return <ComponentToMix {...this.props} {...this.resolveProps()}/>;
    }
  };