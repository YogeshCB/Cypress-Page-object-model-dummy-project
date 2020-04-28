import { isUndefined, isString } from "@bit/kubric.utils.common.lodash";
import services from "../../../../services";
import assetActions from "../../../../store/objects/assets/actions";
import { getFileKey } from "../../../../lib/utils";
import folderListPack from '../../../../store/objects/lists/assets/folders';

const MAX_RETRIES = 5;

export default class Folder {
  static initialized = false;

  static init(store) {
    Folder.initialized = true;
    Folder.store = store;
  }

  static sanitizePath(path = '') {
    if (path.length > 0) {
      if (!/^\//.test(path)) {
        return `/${path}`;
      } else if (/^(?:\/\/)/.test(path)) {
        return path.replace(/^\//, '');
      }
    }
    return path;
  }

  constructor({ name, parent, id, path, files = [], folders = [] } = {}) {
    this.name = name;
    this.parent = parent;
    this.files = files;
    this.folders = folders;
    this.parentPath = path;
    this.id = id;
    this.created = !isUndefined(this.id);
  }

  _getParentPath() {
    let path = '';
    if (!isUndefined(this.parent)) {
      path = this.parent.getPath();
    } else if (isString(this.parentPath)) {
      path = this.parentPath;
    }
    return Folder.sanitizePath(path);
  }

  _getParentId() {
    return !isUndefined(this.parentPath) ? this.parentPath.split('/').pop() : this.parent.id;
  }

  getPath() {
    if (isUndefined(this.id)) {
      throw new Error("Folder not created");
    }
    return Folder.sanitizePath(`${this._getParentPath()}/${this.id}`);
  }

  _addFile(file) {
    this.files.push(file);
  }

  _findSubfolder(name) {
    return this.folders.find(folder => folder.name === name);
  }

  _createSubfolder(name) {
    const folder = new Folder({
      parent: this,
      name: name
    });
    this.folders.push(folder);
    return folder;
  }

  _createFolder() {
    const data = {
      name: this.name,
      description: this.name,
    };
    const folderTempKey = getFileKey(this, data.path);
    return !this.created ?
      services.assets.newFolder()
        .notifyStore()
        .send({
          ...data,
          path: this._getParentPath(),
          asset_type: "folder",
          url: "None",
          folderId: this._getParentId() === 'root' ? '' : this._getParentId()
        }, {
          extraData: {
            ...data,
            path: this._getParentId(),
            url: "None",
            parent: this.parent.id,
            asset_type: "inactive_folder",
            selectable: false,
            hoverable: false,
            actionable: false,
            id: folderTempKey,
            appendAt: "start",
          }
        })
        .then(response => {
          Folder.store.dispatch(folderListPack.actions.replaceRow({
            old: folderTempKey,
            new: {
              ...response,
              asset_type: 'active_folder',
              selectable: false,
              hoverable: false,
            }
          }));
          this.id = response.id;
          this.created = true;
          return this.id;
        }) : Promise.resolve(this.id);
  }

  _triggerFileUpload(data = {}) {
    if (!this.created) {
      throw new Error("Unable to upload file to folder. Folder has not been created");
    }
    if (!Folder.initialized) {
      throw new Error("Folder class is not initialized");
    }
    if (this.files.length > 0) {
      setImmediate(() => {
        Folder.store.dispatch(assetActions.fileUpload({
          files: this.files,
          path: this.getPath(),
          ...data,
        }));
      });
    }
  }

  static getPaths(path) {
    if (Array.isArray(path)) {
      return path;
    } else {
      return path.split('/');
    }
  }

  addFileToPath(path, file) {
    const pathSplits = Folder.getPaths(path);
    if (pathSplits.length > 0) {
      pathSplits.reduce((folder, folderName, index) => {
        let subFolder = folder._findSubfolder(folderName);
        if (!subFolder) {
          subFolder = folder._createSubfolder(folderName);
        }
        if (index === pathSplits.length - 1) {
          subFolder._addFile(file);
        }
        return subFolder;
      }, this);
    }
  }

  createAll(data = {}) {
    let retries = 5;
    const createFolder = () =>
      this._createFolder()
        .then(() => {
          this._triggerFileUpload(data);
          this.folders.forEach(folder => folder.createAll());
        })
        .catch(err => {
          if (retries < MAX_RETRIES) {
            retries++;
            return createFolder();
          } else {
            console.log(err);
            throw err;
          }
        });
    return createFolder();
  }
}