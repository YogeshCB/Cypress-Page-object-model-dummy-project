import { h, Component } from 'preact';
import { isUndefined, isFunction } from "@bit/kubric.utils.common.lodash";
import Selectable from "../../hoc/Selectable";
import styles from 'stylesheets/components/commons/media/folder/compact';
import appIcons from 'stylesheets/icons/app';

const RECENT_DIFF_MINUTES = 5

const wasCreatedRecently = dateString =>{
  if(dateString === undefined){
    return true;
  }
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffTimeMillSeconds = Math.abs(now.getTime() - createdDate.getTime());
  const diffTimeMinutes = Math.ceil(diffTimeMillSeconds / 60000)    ; 
  return diffTimeMinutes <= RECENT_DIFF_MINUTES;
}

export default class CompactFolder extends Component {
  handleDoubleClick(e) {
    const { actionable = true } = this.props;
    if (actionable) {
      const { data: folder, onUnselected, onSelected, onClick, selectable = true, isSelected } = this.props;
      if (!isUndefined(this.clickTimeout)) {
        setImmediate(onClick, folder);
        clearTimeout(this.clickTimeout);
        this.clickTimeout = undefined;
      } else {
        this.clickTimeout = setTimeout(() => {
          selectable && setImmediate(isSelected ? onUnselected : onSelected, folder, e);
          clearTimeout(this.clickTimeout);
          this.clickTimeout = undefined;
        }, 250);
      }
    }
  };

  toggleActions = e => {
    e.stopPropagation();
    const { onToggleActions } = this.props;
    isFunction(onToggleActions) && setImmediate(onToggleActions);
  };

  componentDidMount(){

  }

  render() {
    const {
      isSelected, data: folder, isShared, actionsElmt, shrinkOptions, showActions, selectable = true, actionable = true, onFocus, onBlur, managingFocus
    } = this.props;
    
    const renderedFolder = (
      <div
        tabindex={"-1"}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={ip => (this[`folder${folder.name}`] = ip)}
        className={`${styles.folder} ${(selectable && isSelected) ? styles.selectedFolder : ''} ${!actionable ? styles.inactive : ''}`}>
        {isShared ? <span className={`${styles.folderIcon} ${appIcons.iconFolderShared}`}/> :
          <span className={`${styles.folderIcon} ${appIcons.iconFolderFilled}`}/>}
        <span className={`${isSelected ? styles.nameSelected : ''} ${shrinkOptions?styles.nameFont:''} ${styles.name}`}>{folder.name}</span>
        { wasCreatedRecently(folder.created_time) && <span className={`${styles.recent}`}>New</span>}
        {actionable ? (
          <span className={`${appIcons.iconMoreOptions} ${styles.options}`} onClick={::this.toggleActions}/>
        ) : <span/>}
        {(actionable && showActions) ? actionsElmt : <span/>}
      </div>
    );
    return selectable ? (
      <div onClick={::this.handleDoubleClick}>
        <Selectable 
          theme={{ container: styles.selectedParent }} 
          selected={isSelected}
          onSelect={() => {
            managingFocus && this[`folder${folder.name}`].focus();
          }}
        >
          {renderedFolder}
        </Selectable>
      </div>
    ) : (
      <div onClick={::this.handleDoubleClick}>
        {renderedFolder}
      </div>
    );
  }
};

export const InactiveFolder = props => <CompactFolder {...props} selectable={false} actionable={false}/>