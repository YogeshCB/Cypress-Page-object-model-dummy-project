import { h } from 'preact';
import Form from './forms/index';
import NewFolder from './forms/newfolder';
import UploadDialog from './UploadDialog';
import Assets from '../../components/Assets';
import appIcons from 'stylesheets/icons/app';
import styles from 'stylesheets/assets/index';
import drawerStyles from 'stylesheets/assets/form';
import mixinUploader from './assetUploader';
import Modal from '../../components/commons/Modal';
import ShutterstockLicense from './forms/sslicense';
import fontIcons from 'stylesheets/icons/fonticons';
import ClickOutside from '../../mixins/ClickOutside';
import TagFilterTypes from '../../components/TagFilterTypes';
import { getUploadButton, LinkButton } from "../../components/commons/misc";
import TaggingForm from './forms/TaggingForm';
import Drawer from '../../components/commons/Drawer';
import { assetAcceptTypes, assetWhiteList } from "../../lib/constants";
import FolderStatus from './folderstatus';
import SelectBox from '../../components/commons/SelectBox';
import AssetActions from './AssetActions';
import FullScreenAsset from './FullScreenAsset';

const AssetsPage = props => {
  const {
    onClearAssetSelections, filterString, showTasksModal, deleteVariantDialog, deleteAssetVariant,
    onFilterChange, onFilterSelected, onFilterDeleted, filters, onLoadNext, folder, onCreateFolder, onCloseFolder,
    licenseModal, showLicenseModal, hoveredIndex, data, uploadMenu, showUploadMenu, hideUploadMenu, onHideLicenseModal,
    showFilters, taggingForm, tagAssets, confirmBulkTag, onFolderUpload, enableGrid, clearAssetAndFolderSelections,
    onFileSelected, foldersList, showFolderDetailsStatus, selectedFolderPath, showFolderPath, onPathClicked, exactPath,
    searchInFolder, folderName, showFullscreen, fullScreenMode, selectedForm, form, onRetryTask, grid, errorMessage,
    onSelectTeams
  } = props;

  const { results: folderAssets, selected: selectedFolderAssets = [] } =  foldersList;
  const { results: assets = [], selected = [] } = data;
  
  let selectedAsset;
  if (assets.length > 0 && typeof selected[0] !== 'undefined') {
    selectedAsset = assets[selected[0]];
  }
  if (selectedFolderAssets.length > 0) {
    selectedAsset = folderAssets[selectedFolderAssets[0]];
  } 
  const UploadButton = getUploadButton({
    accept: assetAcceptTypes,
    multipleUpload: true,
  });

  const UploadFolderButton = getUploadButton({
    accept: assetAcceptTypes,
    multipleUpload: true,
  });

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

  const UploadMenu = ClickOutside({
    component: UploadButtons,
    props: {
      theme: styles,
      className: styles.upload,
      close: hideUploadMenu
    }
  });
  const showForm = (selected.length === 1 && selectedAsset.asset_type !== 'folder') || showFolderDetailsStatus;
  const searchOptions = [{label:'Everywhere', value: false},{label:folderName, value: true}]
  
  const isSortPrivateSelected = filters.selected.filter(flt => flt.id === 'private' || flt.id === 'created_time');
  const isSearchEnabled = typeof query === 'string' && query.length > 0 || (filters.selected.length !== isSortPrivateSelected.length);
  return (
    <div className={styles.pageContainer}>
      <div className={styles.topSection}>
        {isSearchEnabled?<SelectBox onChange={searchInFolder} theme={styles} value={exactPath} options={searchOptions}/>:''}
        <TagFilterTypes theme={styles} icon={fontIcons.fonticonSearch} label='Search' source={[]} 
          selected={filters.selected.filter(filter=> filter.id === 'query')} 
          value={filters.selected.filter(filter=> filter.id === 'query')} isLoading={false} 
          onChange={onFilterChange} showSelected={true} onSelected={onFilterSelected} 
          onDeleted={onFilterDeleted} freeEntry={true}
        />
        {(selected.length > 0 || selectedFolderAssets.length > 0)?
        <AssetActions {...props} selectedAsset={selectedAsset} selectedFolderAssets={selectedFolderAssets} selected={selected} /> 
        : <div className={styles.uploadSection}>         
          {isSearchEnabled?'':<LinkButton onClick={showUploadMenu} className={styles.upload} theme={styles}><span
            className={`${appIcons.iconAddO} ${styles.uploadIcon}`}/> New</LinkButton>}
        </div>}
        {uploadMenu && <UploadMenu/>}
      </div>
      <div>
          <Assets {...props} selectedAsset={selectedAsset} hoveredIndex={hoveredIndex} asset_type={'Image'} assets={assets} onLoadNext={onLoadNext}
                  hideSearch={true} isModal={false} hideActions={true} theme={{ ...styles, }}/>                
          <Modal visible={folder.open} onHide={onCloseFolder} theme={styles}>
            <NewFolder close={onCloseFolder} selectedAsset={selectedAsset} {...props} />
          </Modal>
          <Modal visible={licenseModal} onHide={onHideLicenseModal} theme={styles}>
            <ShutterstockLicense asset={selectedAsset} {...props} />
          </Modal>
          {showFolderPath? <FolderStatus onClick={onPathClicked} selectedFolderPath={selectedFolderPath}/>:''}
          <Modal theme={{modalContent:styles.fullscreenmodalContent}} visible={showFullscreen} onHide={fullScreenMode}>
              <FullScreenAsset grid={grid} asset={selectedAsset} />
          </Modal>
          <Drawer heading={`Editing ${selected.length} assets.`}
                theme={{ ...drawerStyles, heading: drawerStyles.headerTaggingForm }} show={taggingForm}
                onHide={tagAssets}>
            <TaggingForm confirmBulkTag={confirmBulkTag} selected={selected} assets={assets} {...props}/>
          </Drawer>
        <UploadDialog shrink={showForm || showFilters} showTasksModal={showTasksModal} {...props}/>
        <Form {...props} onSelectTeams={onSelectTeams} showFilters={showFilters} selected={selected} showLicenseModal={showLicenseModal}
              show={showForm} asset={selectedAsset}
              onHide={onClearAssetSelections} staticForm={filterString.indexOf('private:false') > -1}/>        
        </div>
    </div>
  );
};

const AssetsUploader = mixinUploader(AssetsPage, {
  theme: {
    container: styles.dropContainer,
    dragover: styles.dragover
  },
  whiteListSet: assetWhiteList,
  multipleUpload: true,
  dropOnly: true,
});

export default props => (
  <div className={styles.assetsPage}>
    <AssetsUploader accept={assetAcceptTypes} {...props} onDropped={results => props.onFileSelected(results, true)}/>
  </div>
)