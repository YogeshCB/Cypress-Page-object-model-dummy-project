import store from '../../index';
import config from '../../../config';
import { at } from "@bit/kubric.utils.common.lodash";

const profile = state => (state || store.getState()).profile;

const idAdder = (network, data) => ({
  ...data,
  id: network,
});

const networkModifiers = {
  facebook({ adaccount, oauth, business }) {
    return {
      id: 'facebook',
      adaccount,
      business,
      oauth,
    };
  },
  cloudinary: idAdder.bind(null, 'cloudinary'),
  shutterstock: idAdder.bind(null, 'shutterstock'),
  drive() {
    return {
      id: 'drive',
    };
  },
};

const extractNetworks = (networks, data) => networks.reduce((acc, network) => {
  data[network] && acc.push(networkModifiers[network] ? networkModifiers[network](data[network]) : data[network]);
  return acc;
}, []);

const getProfileSaveData = state => {
  const profileState = profile(state);
  const adnetworks = extractNetworks(config.publisher.active, getNetworks(state));
  const assetnetworks = extractNetworks(config.assets.networks.active, getNetworks(state));
  return ({
    account: {
      ...profileState.account,
    },
    adnetworks,
    assetnetworks,
  });
};

const getCurrentPublisher = state => profile(state).currentPublisher;

const getUIData = state => profile(state).ui;

const getUIDataFor = (network, state) => getUIData(state)[network] || {};

const getNetworks = state => profile(state).networks;

const getNetwork = (network, state) => getNetworks(state)[network];

const getCurrentAssetNetwork = state => profile(state).currentAsset;

const getDriveFolders = state => at(getNetwork('drive', state), 'folders', [])[0];

export default {
  profile,
  getProfileSaveData,
  getUIData,
  getCurrentPublisher,
  getNetworks,
  getNetwork,
  getUIDataFor,
  getCurrentAssetNetwork,
  getDriveFolders,
};