import { h, Component } from 'preact';

export const objectType = (props, propName, componentName) => {
  componentName = componentName || 'ANONYMOUS';
  return props[propName] ? null : new Error(`${propName} in ${componentName} failed object proptype`);
};

export default class ContextProvider extends Component {
  static contextTypes = {
    router: objectType,
    store: objectType,
    location: objectType,
  };
}