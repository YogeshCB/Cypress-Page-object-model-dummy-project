import store from '../../../../store';

const roles = state => (state || store.getState(state)).workspace.roles;

export default {
    roles
}