import profileSelectors from "../../selectors";
import services from "../../../../../services";
import notificationActions from '../../../notifications/actions';

const onDeleteFolder = folderId => () => {
  const folders = profileSelectors.getDriveFolders();
  services.networks.updateFolders()
    .notifyStore()
    .send({
      network: 'drive',
      folders: folders.filter(({ id }) => id !== folderId),
    });
};

const onAddFolder = folder => () => {
  const folders = profileSelectors.getDriveFolders();
  services.networks.updateFolders()
    .notifyStore()
    .send({
      network: 'drive',
      folders: [
        ...folders,
        ...folder,
      ]
    })
    .then(res=> {
      dispatch(notificationActions.addNotification({
        type: 'success',
        message: 'Added Folders Successfully'
      }))
    });
};

export default {
  onDeleteFolder,
  onAddFolder,
};