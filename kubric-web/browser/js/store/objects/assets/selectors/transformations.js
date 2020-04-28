import store from '../../../../store';

const assets = state => (state || store.getState()).assets;

const transformation = state => assets(state).transformations;

const getTransformData = state => transformation(state).data;

const getTransformFormState = state => transformation(state).selected;

const getFormStatus = state => transformation(state).form;

const getTransformUrls = state => transformation(state).urls;

const getTransformLoading = state => transformation(state).loading;

const getImageFilters = state => assets(state).imageFilters;

const getFilterStatus = state => assets(state).showFilters;

export default {
    getTransformData,
    getImageFilters,
    getFormStatus,
    getFilterStatus,
    getTransformData,
    getTransformLoading,
    getTransformUrls,
    getTransformFormState
}