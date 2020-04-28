import { h, Component } from 'preact';
import styles from 'stylesheets/assets/folders'
import CompactFolder, { InactiveFolder } from '../../../components/commons/media/folder/compact';
import ClickOutside from "../../../mixins/ClickOutside";
import FolderActions from "./Actions";

export default class Folders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false,
      id: ''
    }
  }

  _handleKeyDown = event => {
    const { folderKeyHandler } = this.props;
    const { managingFocus } = this.state;
    managingFocus && folderKeyHandler && folderKeyHandler(event);
  };

  _handleDocumentClick = event => {
		const { unselectAllFolders } = this.props;
		if (unselectAllFolders && event && event.target && event.target.id === 'container') {
			unselectAllFolders();
		}
  };

  toggleActions(id) {
    const { onRowSelected } = this.props;
    const shouldShowActions = !this.state.showActions;
    if(id) {
      onRowSelected({id})
    }
    this.setState({
      showActions: shouldShowActions,
      id: shouldShowActions ? id : ''
    });
  };

  onBlur=() => {
    this._timeoutID = setTimeout(() => {
      if (this.state.managingFocus) {
        this.setState({
          managingFocus: false
        });
      }
    }, 0);
  }

  onFocus=() => {
    clearTimeout(this._timeoutID);
    if (!this.state.managingFocus) {
      this.setState({
        managingFocus: true
      });
    }
  }
  
	componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
    document.addEventListener("click", this._handleDocumentClick);
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    document.removeEventListener("click", this._handleDocumentClick);
  }

  render() {
    const { data, onFolderClick: onSelected, onRowUnselected: onUnselected, onAssetClick, showFilters, folderKeyHandler,
      selectAllFolders, unselectAllFolders, isSearchEnabled, assets, selectedAssets, taggingForm, assetSelected, onBlur, onFocus } = this.props;
    const { showActions, id, managingFocus } = this.state;
    const { results: folders, selected = [] } = data;
    const selectedSet = new Set(!Array.isArray(selected) ? [selected] : selected);
    const Actions = ClickOutside({
      component: FolderActions,
      props: {
        close: ::this.toggleActions
      }
    });
    
    return <div className={styles.container}  ref={container => { this.container = container}}>
      {folders.length===0?'':<div className={styles.header}><h3 className={styles.title}>Folders</h3>
        <div className={styles.separator}></div>
        <span className={styles.selectAction} onClick={selected.length >0?unselectAllFolders:selectAllFolders}>
          {selected.length >0 ?'Unselect All':'Select All'} ({selected.length>0 && selected.length!==folders.length?selected.length:folders.length})
        </span>
      </div>}
      <div 
        className={styles.folderGrid} 
        id={"container"}>
        {folders.map((folder, index) => {
          const FolderComponent = folder.type === 'inactive_folder' ? InactiveFolder : CompactFolder;
          const actionsElmt = <Actions theme={styles} id={folder.id}/>;
          const isSelected = selectedSet.has(index);
          const isShared = folder.shared_with && folder.shared_with.length > 1;
          return <FolderComponent shrinkOptions={showFilters || taggingForm || assetSelected.length === 1} isSelected={isSelected} isShared={isShared} data={folder} onUnselected={onUnselected}
                                  onToggleActions={this.toggleActions.bind(this, folder.id)} onSelected={onSelected}
                                  showActions={showActions && (folder.id === id)} actionsElmt={actionsElmt}
                                  onClick={onAssetClick.bind(null, folder)} onBlur={this.onBlur} onFocus={this.onFocus} managingFocus={managingFocus}/>;
        })}
      </div>
    </div>
  }
}