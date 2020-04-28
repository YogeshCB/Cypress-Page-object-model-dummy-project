import { h, Component } from 'preact';
import { InfiniteMediaGrid } from '../commons/MediaGrid';
import styles from 'stylesheets/assets';
import extensionStyles from 'stylesheets/assets/extensions';
import modalStyles from 'stylesheets/components/assets';
import config from '../../config/index';
import appIcons from 'stylesheets/icons/app';
import EmptyPage from '../EmptyPage';
import Navigator from '../../pages/assets/Navigation';
import { File } from '../commons/media/File';
import Folders from '../../pages/assets/Folders';
import Folder, { InactiveFolder } from "../commons/media/folder";
import gridStyles from 'stylesheets/components/commons/mediagrid';

const componentMapOverride = {
  image: {
    extensions: {
      psd: {
        component: File,
        props: (mediaData, { theme = {} }) => ({
          file_type: mediaData.file_type,
          image: mediaData.url || mediaData,
          theme: {
            ...styles,
            ...theme,
            svgStyle: extensionStyles.psd
          },
        }),
      },
      gif: {
        component: File,
        props: (mediaData, { theme = {} }) => ({
          file_type: mediaData.file_type,
          image: mediaData.url || mediaData,
          theme: {
            ...styles,
            ...theme,
            svgStyle: extensionStyles.gif
          },
        }),
      }
    }
  },
  video: {
    extensions: {
      mov: {
        component: File,
        props: (mediaData, { theme = {} }) => ({
          file_type: mediaData.file_type,
          media: mediaData.url || mediaData,
          color: '#45A9EF',
          theme: {
            ...styles,
            ...theme,
            svgStyle: extensionStyles.mov
          }
        })
      }
    }
  },
  inactive_folder: {
    component: InactiveFolder,
    props: (mediaData, { size, view = 'tiles', theme = {} } = {}) => ({
      view,
      size,
      theme,
      folder: mediaData,
      path: mediaData.path,
      name: mediaData.name,
      className: gridStyles.folderContainer
    })
  },
  active_folder: {
    component: Folder,
    props: (mediaData, { size, view = 'tiles', userEmail, performAction, theme = {}, onSelected } = {}) => ({
      view,
      size,
      theme,
      performAction,
      folder: mediaData,
      path: mediaData.path,
      name: mediaData.name,
      onClick: onSelected.bind(null, mediaData),
      className: gridStyles.folderContainer,
      shared: mediaData.owner !== userEmail
    })
  }
};

const defaultThumbnail = config.assets.thumbnailURL;

const getEmptyPageProps = (isSearchEnabled, errorMessage) => {
  if (isSearchEnabled) {
    return {
      subheading: errorMessage !=='' ?errorMessage:`Could not find any matching assets`,
      theme: { icon: appIcons.iconAssetsNotFound },
    }
  } else {
    return {
      heading: `This folder is empty`,
      subheading: `You have not uploaded any assets here, you can do that by dragging and dropping your assets here or click on the new button`,
      theme: { icon: appIcons.iconEmptyFolder }
    }
  }
};

export default ({
                  userEmail, filterString, filters, selectAll, unselectAll, HeaderComponent,
                  loading, completed, data, onLoadNext, onRowSelected, performAction, isPickerOpen,
                  onRowUnselected, theme = {}, foldersList, selectedAsset,
                  asset_type = 'image', showFilters, onAssetClick, taggingForm, selectedFolderAssets, selectedAssetIds,
                  showFolderDetailsStatus, onRetryUpload, grid, assetKeyHandler,  errorMessage, onClearRowSelections
                }) => {
  foldersList = foldersList.results || [];
  const gridTheme = {
    image: modalStyles.imageContainer,
    scroller: modalStyles.scroller,
    textOverlay: modalStyles.imageTextOverlay,
    video: styles.video,
    audio: styles.audio,
    ...theme,
  };
  let { results: assets = [], selected = [] } = data;
  
  assets = assets.map(asset => {
    const {
      shared_with = [], asset_type: type, tags = [], croppedUrl: url, url: orgUrl, thumbnail = defaultThumbnail, file_type,
      selectable = true, hoverable = true, actionable = true
    } = asset;
    return ({
      ...asset,
      url: url || orgUrl,
      thumbnail,
      shared_with,
      onRetryUpload,
      grid,
      type,
      file_type: file_type ? file_type.substring(1) : file_type,
      tags,
      selectable,
      hoverable,
      actionable
    })
  });
  const isSortPrivateSelected = filters.selected.filter(flt => flt.id === 'private' || flt.id === 'created_time');
  const shrinkOptions = showFilters || selected.length === 1 && selectedAsset.asset_type !== 'folder' || taggingForm || showFolderDetailsStatus;
  const query = filters.selected.reduce((acc, filter) => {
    if (filter.id === 'query' && filter.data.value.length > 1) {
      return filter.data.value;
    }
  }, '');
  const isSearchEnabled = typeof query === 'string' && query.length > 0 || (filters.selected.length !== isSortPrivateSelected.length)
  
  return (
    <div className={theme.assets}>
      <Navigator theme={theme} selectedAsset={selectedAsset} selectedFolderAssets={selectedFolderAssets} isPickerOpen={isPickerOpen} selected={selected}/>
      <div className={`${styles.assetsSection} ${theme.assetsSection}`}>
        {(!loading && ((assets.length === 0 && isSearchEnabled) || (foldersList.length === 0 && assets.length === 0))) ? (
          <EmptyPage
            className={`${styles.shrinker} ${shrinkOptions && !isPickerOpen ? styles.doShrink : ''}`} {...getEmptyPageProps(isSearchEnabled, errorMessage)}/>
        ) : (<div className={`${styles.shrinker} ${shrinkOptions && !isPickerOpen ? styles.doShrink : ''}`}>
            <InfiniteMediaGrid isPickerOpen={isPickerOpen} isSearchEnabled={isSearchEnabled || filterString.indexOf('private:false') > -1}
              selectAll={selectAll} unselectAll={unselectAll} shrinkOptions={shrinkOptions}
              HeaderComponent={HeaderComponent === false? undefined : filters.selected.length === isSortPrivateSelected.length && filterString.indexOf('private:true') > 1 ? Folders : undefined}
              userEmail={userEmail} performAction={performAction} selected={selected} selectedIds={selectedAssetIds} media={assets.filter(({name}) => name !== 'Archive.zip').filter(({file_type}) => file_type !== 'zip' )}
              onMultipleSelected={onRowSelected} onLoadNext={onLoadNext} theme={gridTheme}
              onUnselected={onRowUnselected} loading={loading} onSelected={onAssetClick}
              type={asset_type} completed={completed} componentMap={componentMapOverride}
              keyHandler={assetKeyHandler} clearSelection={onClearRowSelections}
            />
          </div>
        )}
      </div>
    </div>
  );
};
