import { connect } from 'preact-redux';
import PropResolver from '../../../mixins/PropResolver';
import { isFunction } from "@bit/kubric.utils.common.lodash";

export default (selectors, resolvers) => (conf, { mapStateToProps, mapDispatchToProps = {} }) => component =>
  connect(state => {
    const props = isFunction(mapStateToProps) ? mapStateToProps(state) : {};
    return ({
      byId: selectors.getById(),
      stats: selectors.getStats(),
      allIds: selectors.getAllIds(),
      ...props
    });
  }, mapDispatchToProps)(PropResolver(component, conf, resolvers));