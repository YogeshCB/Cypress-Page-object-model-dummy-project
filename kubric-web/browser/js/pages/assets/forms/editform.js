import { h, Component } from 'preact';
import { copy, StaticField } from "../../../components/commons/misc";
import Field from '../../../components/commons/Field';
import styles from 'stylesheets/assets/form';
import transformStyles from 'stylesheets/assets/transform';
import { SearchBox } from "../../../components";
import Transformation from './Transformation';
import appIcons from 'stylesheets/icons/app';
import fonticons from 'stylesheets/icons/fonticons';
import config from '../../../config/index';
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import Video from '../../../components/commons/media/Video';
import Audio from '../../../components/commons/media/Audio';
import Variants from './Variants';
import downloadFile from 'downloadjs';
import VariantName from './VariantName';
import { getUploadButton, LinkButton } from "../../../components/commons/misc";
import VisualAction from './VisualActions';
import { getFullDate } from "../../../lib/date";
import { FileSVG } from '../../../components/commons/media/File';

export default class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: false,
      tooltip: false,
      color: undefined,
      copyText: 'Copy URL',
      error: '',
      showEdit: false,
      editName: false
    }
  }

  
  onFieldChange(field, value) {
    const { asset = {}, onRowChange } = this.props;
    const { id } = asset;
    this.setState({
      error: ''
    })
    onRowChange && onRowChange({
      id,
      data: {
        [field]: value,
      }
    });
  }

  
  onTagAction(action, tag) {
    const { asset = {}, onRowValueDelete, onRowValueAppend, onSave } = this.props;
    const fn = action === 'delete' ? onRowValueDelete : onRowValueAppend;
    const { id } = asset;
    fn && fn({
      id,
      field: 'tags',
      data: tag,
    });
    onSave(id);
  }

  onTeamAction(action, team) {
    const { onSelectTeams, confirmShare } = this.props;
    onSelectTeams(action === 'delete'?true:false, team.value, confirmShare);      
  }

  showCopied = () => {
    this.setState({
      feedback: true
    });
    setTimeout(() => {
      this.setState({
        feedback: false
      })
    }, 600);
  };

  showTooltip = (color) => {
    this.setState({
      tooltip: true,
      color
    });
  };

  hideTooltip = () => {
    this.setState({
      tooltip: false,
      color: undefined
    });
  };
  toggleEditOver = () => {
    this.setState({
      showEdit: !this.state.showEdit
    })
  }
  closeRename = () => {
    this.setState({
      editName: false
    })
  }
  openRename = () => {
    this.setState({
      editName: true
    })
  }
  saveName = () => {
    const { asset, onSave } = this.props;
    const { filename, id } = asset;
    if (filename.length === 0) {
      this.setState({
        error: 'Name cannot be blank'
      })
    } else {
      this.closeRename();
      onSave(id);
    }
  }
  onEnter = (e) => {
    if (e.keyCode === 13) {
      this.saveName();
    }
  }
  getFields = type => {
    const { asset = {}, teams = [] } = this.props;
    const {
      name, tags = [], filename = '', shared_with = [],
      width, height, created_time, file_type, id, owner, creator,
      description, created
    } = asset;
    const { editName, showEdit, error } = this.state;
    const shared_withResolved = teams.filter((team) => shared_with.indexOf(team.team_id) > -1);
    const source = teams.filter(team => shared_with.indexOf(team.team_id) < 0).map((team) => ({
      label: team.name,
      data: team.team_id,
      value: team.team_id
    }));
    const sharedWith = shared_withResolved.map((team) => ({
      label: team.name,
      data: team.team_id,
      value: team.team_id
    }));
    const createdTime = new Date(created_time || created);
    switch (type) {
      case 'folder':
        return [<StaticField label="Name" value={name}/>,
          createdTime?<StaticField label="Created on" value={getFullDate(createdTime)}/>:'',
          <StaticField label="Creator" value={creator?creator:owner}/>,
          <SearchBox label={source.length>0?'Shared With':'Share this folder with'} source={source} value={sharedWith} showSelected={true}
                     onSelected={this.onTeamAction.bind(this, 'append')}
                     onDeleted={this.onTeamAction.bind(this, 'delete')} theme={styles}/>]
      case 'image':
      case 'font':
      case 'video':
      case 'audio':
      default:
        return [editName ?
          <div className={styles.editName}>
            <Field error={error} onKeyUp={this.onEnter} label="Name" theme={styles} value={filename}
                   onChange={this.onFieldChange.bind(this, 'filename')}/>
            <LinkButton onClick={this.saveName}>Save</LinkButton>
          </div> :
          <div className={styles.editName} onClick={this.openRename} onMouseOver={this.toggleEditOver}
               onMouseOut={this.toggleEditOver}>
            <StaticField label="Name" value={filename}/>
            {showEdit ? <span className={`${fonticons.fonticonEdit} ${styles.icon} ${styles.editIcon}`}/> : ''}
          </div>,
          description ? <StaticField label="Description" value={description}/>:'',
          <StaticField label="Type"
                       value={`${isUndefined(file_type) ? '' : file_type.substring(1, file_type.length).toUpperCase()} ${width ? `(${width}x${height})` : ''}`}/>,
          <StaticField label="Created on" value={getFullDate(createdTime)}/>,
          owner && <StaticField label="Creator" value={creator? creator:owner}/>,
          <SearchBox label={source.length>0?'Shared With':'Share this asset with'} source={source} value={sharedWith} showSelected={true}
                     onSelected={this.onTeamAction.bind(this, 'append')}
                     onDeleted={this.onTeamAction.bind(this, 'delete')} theme={styles}/>,
          <SearchBox label="Tags" value={tags} freeEntry={true} showSelected={true}
                     onSelected={this.onTagAction.bind(this, 'append')}
                     onDeleted={this.onTagAction.bind(this, 'delete')} theme={styles}/>]
    }
  };

  getPalette = palette => {
    const { feedback, color, tooltip } = this.state;
    return (
      <span className={styles.palette}>
        {palette.map((color) => <span onMouseOut={this.hideTooltip}
                                      onMouseOver={this.showTooltip.bind(this, `#${color}`)}
                                      onClick={(e) => copy(e, this.showCopied, `#${color}`)}
                                      className={styles.patch}
                                      style={{ backgroundColor: `#${color}` }}/>)
        }
        {feedback && <span className={styles.feedback}>Copied!</span>}
        {tooltip && color && (
          <span className={styles.colorTooltip}>
            <span style={color ? { background: `${color}` } : {}} className={styles.colorSqr}/>
            &nbsp;{color}
          </span>)}
      </span>
    );
  };


  render() {
    const {
      asset = {}, form, setForm, deleteAssetVariant, fullScreenMode, showDeleteVariant, variantDialog, setActiveVariant,
      variantNameDialog, hideTransformation, setActiveAsset, enableGrid, deleteVariantDialog, onConfirmTransform,
      setActive, showDeleteModal, showTransformation, selectedForm, onFileSelected, isVariant
    } = this.props;

    const { width, height, filename, url, thumbnail, file_type, asset_type, palette = [], versions } = asset;
    const UploadButton = getUploadButton({
      accept: file_type,
      multipleUpload: false,
      theme: {
        container: styles.uploadContainer
      }
    });
    const actions = [{
      icon: `${fonticons.fonticonDownloadOutline} ${styles.iconAction}`,
      onClick: () => {
        const downloadURL = url.indexOf('https://lh3') > -1 || url.indexOf('http://lh3') > -1 ? url + '=s0' : url;
        const x = new XMLHttpRequest();
        x.open("GET", downloadURL, true);
        x.responseType = "blob";
        x.onload = function (e) {
          downloadFile(e.target.response, filename);
        };
        x.send();
      },
      name: 'download'
    }, {
      icon: `${appIcons.iconAssetEdit} ${styles.iconAction}`,
      onClick: () => {
        setForm('transform');
        showTransformation('FILTER')
      },
      name: 'edit'
    }, {
      icon: `${appIcons.iconVersion} ${styles.iconAction}`,
      onClick: () => {
        setForm('version');
        hideTransformation()
      },
      name: 'version'
    }]

    return (
      <div onMouseDown={()=> {event.stopPropagation()}}>
        <div className={`${styles.editForm}`} ref={node => this.form = node}>
          {form === 'transform' && <div className={`${transformStyles.actions} ${transformStyles.save}`}>
            <span onClick={() => {
              hideTransformation();
              setForm('')
            }} className={`${appIcons.iconLeftArrow} ${transformStyles.icon}`}/>
            <LinkButton onClick={variantDialog}>Save</LinkButton>
          </div>}
          {asset_type === 'image' && <Transformation form={form} theme={styles} height={height} width={width}
                                                     drawerWidth={this.form && this.form.offsetWidth}
                                                     url={url}/>}
          <VisualAction variantDialog={variantDialog} enableGrid={enableGrid} asset_type={asset_type} url={url}
                        fullScreenMode={fullScreenMode}/>
          {asset_type === 'image' && <div className={styles.paletteContainer}>{this.getPalette(palette)}</div>}
          {asset_type !== 'image' && asset_type !== 'folder' ?
            <div className={styles.imgContainer}>
              {asset_type === 'font' && <img className={styles.img} src={thumbnail}/>}
              {asset_type === 'video' && <Video theme={styles} media={url} muted={false}/>}
              {asset_type === 'blob' && <FileSVG theme={styles} file_type={file_type} />}
              {asset_type === 'video' && file_type === '.mov' &&
              <img className={styles.img} src={config.assets.thumbnailURL}/>}
              {asset_type === 'audio' &&
              <Audio theme={{ container: styles.audioContainer, duration: styles.duration }} media={url}/>}
            </div> : ''}
          {selectedForm === '' && form === '' && asset_type !== 'folder' && <div
            className={`${styles.formActions} ${asset_type !== 'image' || file_type === '.gif' ? styles.formActionVideo : ''}`}>
            {actions.map((action) => {
              if ((action.name === 'edit' || action.name === 'version') && (asset_type !== 'image' || file_type === '.gif')) {
                return ''
              } else {
                return <span className={styles.formIcon}><span className={action.icon} onClick={action.onClick}/></span>
              }
            })}
          </div>}
          <VariantName asset={asset} variantDialog={variantDialog} variantNameDialog={variantNameDialog}
                       onConfirm={onConfirmTransform} onCancel={variantDialog}/>
          {form === 'version' && <div className={transformStyles.actions}>
            <span onClick={() => setForm('')} className={`${appIcons.iconLeftArrow} ${transformStyles.icon}`}/>
            <UploadButton directory={false} className={styles.uploadButton} onFileSelected={({ files }) => {
              isVariant();
              onFileSelected({ files });
            }}>
              <span className={`${appIcons.iconUpload} ${styles.icon}`}/>&nbsp;Upload
            </UploadButton>
          </div>}
          {form === 'version' && <Variants
            setActiveAsset={setActiveAsset}
            setActiveVariant={setActiveVariant}
            setActive={setActive}
            versions={versions}
            asset={asset}
            deleteAssetVariant={deleteAssetVariant}
            deleteVariantDialog={deleteVariantDialog}
            showDeleteVariant={showDeleteVariant}
          />}
          {selectedForm === '' && form === '' && <div className={styles.content}
                                                      style={asset_type === 'folder' ? { marginTop: '5rem' } : {}}>
            <div className={styles.fields}>
              {this.getFields(asset_type)}
            </div>
          </div>}
        </div>
      </div>
    );
  }
};