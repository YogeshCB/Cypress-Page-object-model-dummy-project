import  { h } from 'preact';
import FilterPanel from '../assets/forms/FilterPanel';
import Assets from '../../components/Assets/index';
import TagFilterTypes from '../../components/TagFilterTypes';
import UploadDialog from '../assets/UploadDialog';
import styles from 'stylesheets/assets/picker';
import mixinUploader from '../../mixins/uploader';
import fontIcons from 'stylesheets/icons/fonticons';
import appIcons from 'stylesheets/icons/app';
import ClickOutside from '../../mixins/ClickOutside';
import { getUploadButton, LinkButton, SolidButton } from "../../components/commons/misc";
import { assetAcceptTypes, assetWhiteList } from "../../lib/constants";
import Modal from '../../components/commons/Modal';

const AssetPicker = (props) => {
    const {
        showUploadMenu, showTasksModal, isPickerOpen,
        onFilterChange, onFilterSelected, onFilterDeleted, filters, onLoadNext, onCreateFolder,
        data, uploadMenu, hideUploadMenu, showFilters, onFolderUpload, onFileSelected, showFolderDetailsStatus,
        closePicker, network, onAssetSelection,
      } = props;
      
    const { results: assets = [], selected = [] } = data;

    const UploadButton = getUploadButton({
        accept: assetAcceptTypes,
        multipleUpload: true,
    });
    let selectedAsset;
    if (assets.length > 0 && typeof selected[0] !== 'undefined') {
      selectedAsset = assets[selected[0]];
    }
    
    const UploadFolderButton = getUploadButton({
        accept: assetAcceptTypes,
        multipleUpload: true,
    });

    const UploadMenu = ClickOutside({
        component: UploadButtons,
        props: {
          theme: styles,
          className: styles.upload,
          close: hideUploadMenu
        }
    });

    const showForm = (selected.length === 1 && selectedAsset.asset_type !== 'folder') || showFolderDetailsStatus;
    const UploadButtons = () => (
        <div className={styles.menu}>
            <UploadButton directory={false} className={styles.uploadButton}
                            onFileSelected={onFileSelected}>Upload Asset</UploadButton>
            <UploadFolderButton directory multipleUpload={true} className={styles.uploadButton}
                                onFileSelected={onFolderUpload}>Upload Folder</UploadFolderButton>
            <div className={styles.divider}/>
            <LinkButton className={styles.newFolderLink} theme={styles} onClick={onCreateFolder}>Create Folder</LinkButton>
        </div>
    );

    return <Modal onHide={closePicker} theme={styles} visible={isPickerOpen}>
    <div>
        <div className={styles.topSection}>
            <div className={styles.pickerHead}>
              <TagFilterTypes theme={styles} icon={fontIcons.fonticonSearch} label='Search' source={[]} 
                  selected={filters.selected.filter(filter=> filter.id === 'query')} 
                  value={filters.selected.filter(filter=> filter.id === 'query')} isLoading={false} 
                  onChange={onFilterChange} showSelected={true} onSelected={onFilterSelected} 
                  onDeleted={onFilterDeleted} freeEntry={true}
              />
              {selected.length>0?<SolidButton className={styles.button} onClick={onAssetSelection}><span className={`${appIcons.iconWhiteTick} ${styles.tickIcon}`}></span>
                &nbsp;&nbsp;Done</SolidButton>:null}
            </div>
            {showFilters ? <FilterPanel compact={true} {...props} theme={styles} />: null}            
        </div>
        <div className={styles.pickerBottom}>            
            <Assets {...props} theme={showFilters ? styles: {...styles,assets:styles.assetsFullWidth} } foldersList={{results:[]}} picker={true} HeaderComponent={false} selectedAsset={selectedAsset} 
            asset_type={'Image'} assets={assets} onLoadNext={onLoadNext}
            hideSearch={true} isModal={false} hideActions={true}/>
            <UploadDialog shrink={showForm || showFilters} showTasksModal={showTasksModal} {...props}/>            
        </div>
    </div>
    </Modal>
}

const Picker = mixinUploader(AssetPicker, {
    theme: {
      container: styles.dropContainer,
      dragover: styles.dragover
    },
    whiteListSet: assetWhiteList,
    multipleUpload: true,
    dropOnly: true,
  });


export default props => (
    <div className={styles.assetsPicker}>          
          {props.network === 'kubric' ? 
          <Picker accept={assetAcceptTypes} {...props} onDropped={results => props.onFileSelected(results, true)} />:
          <AssetPicker {...props}/>}
    </div>
  )
