import { getOperations } from "@bit/kubric.redux.reducks.utils";
import profileActions from '../actions';
import profileSelectors from '../selectors';
import { getFormErrorActions } from '../../commons/formerrors';
import { validate } from "../../../validator";
import userSelectors from '../../user/selectors';
import assetActions from "../../assets/actions";
import unlinkHandlers from './handlers/unlink';
import linkHandlers from './handlers/link';
import confirmHandlers from './handlers/confirm';
import openHandlers from './handlers/open';
import services from '../../../../services';
import { redirect } from "@bit/kubric.utils.common.router";
import { getProfileUrl } from "../../../../lib/links";

const formErrorActions = getFormErrorActions('profile');

const saveProfile = () => dispatch => {
  const { account, adnetworks, assetnetworks } = profileSelectors.getProfileSaveData();
  const { company_profile } = account;
  const { data, errors } = validate('profile', { ...account });
  const workspace = userSelectors.getWorkspaceId();
  if (errors) {
    dispatch(formErrorActions.setFormErrors(errors));
  } else {
    services.user.updateProfile()
      .notifyStore()
      .send({
        ...data,
        company_profile: {
          [workspace]: {
            ...company_profile[workspace],
            adnetworks: [...adnetworks],
            assetnetworks: [...assetnetworks],
          }
        },
      });
  }
};

const onConfirm = network => dispatch => confirmHandlers[network](dispatch);

const onUnlink = network => dispatch => unlinkHandlers[network](dispatch);

const onOpenNetwork = (section, index, network) => dispatch => {
  const linkHandler = linkHandlers[network];
  let isLinked = true;
  if (linkHandler) {
    isLinked = linkHandlers[network](dispatch);
  }
  if (isLinked) {
    dispatch(profileActions[section === 'asset' ? 'currentAssetChange' : 'currentPublisherChange'](index));
    const openHandler = openHandlers[network];
    openHandler && openHandler(dispatch);
  }
};

const onProfileDataChanged = (name, value) =>
  dispatch => dispatch(profileActions.profileDataChanged({
    [name]: value,
  }));

const onProfilePicSelected = ({files}) =>{
  dispatch => dispatch(assetActions['fileUpload']({ title: 'profilepic', file: files.name, path: '/root', tags: [], attributes: [] }));
}

const onSettingChange = (network, field, value) => dispatch => dispatch(profileActions.networkSettingChange({
    network,
    data: {
      [field]: value,
    },
  }));

const onUIChange = (network, data) => dispatch => {
  dispatch(profileActions.networkUiChange({
    network,
    data,
  }));
};

const onOpenProfile = () => dispatch => redirect(getProfileUrl());

export default {
  ...getOperations(formErrorActions, {
    onClearFormError: formErrorActions.clearFormError,
  }),
  onUIChange,
  onSettingChange,
  onProfileDataChanged,
  saveProfile,
  onOpenNetwork,
  onProfilePicSelected,
  onConfirm,
  onUnlink,
  onOpenProfile
};