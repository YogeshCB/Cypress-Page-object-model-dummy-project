import { h, Component } from 'preact';
import appIcons from 'stylesheets/icons/app';
import styles from 'stylesheets/assets/assetactions';
import folderStyles from 'stylesheets/components/commons/media/action';
import { Spinner } from "../../index";
import Checkbox from '../../commons/Checkbox';
import { SecondaryButton } from '../../commons/misc';
import fontIcons from 'stylesheets/icons/fonticons';
import Field from '../../commons/Field';
import { debounce } from '@bit/kubric.utils.common.lodash';

const Action = ({ className, onClick, icon, label, show }) => show ?
  <span className={className} onClick={onClick}><span className={icon}/>&nbsp;{label}</span> : '';

const FolderIcon = () => (
  <svg className={styles.size} viewBox={`0 0 160 160`} preserveAspectRatio="none">
    <g fill="none">
      <path
        d="M77.955 53h50.04A3.002 3.002 0 0 1 131 56.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 114.995V45.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z"
        fill="#71B9F4">
      </path>
      <path
        d="M77.955 52h50.04A3.002 3.002 0 0 1 131 55.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 113.995V44.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z"
        fill="#92CEFF">
      </path>
    </g>
  </svg>
);

export default class AssetActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      share: false,
      query: ''
    };
  }

  onSearch = (value) => {
    this.setState({
      query: value
    })
  }

  handleClick = e => {
    if (this.state.visible && this.nodeFolder && this.nodeFolder.contains(e.target)) {
      return
    }
    if (this.state.share && this.nodeTeams && this.nodeTeams.contains(e.target)) {
      return
    }

    this.setState({
      visible: false,
      share: false,
    })
  };


  componentDidMount() {
    document.addEventListener('keydown', this.close);
    document.addEventListener("mousedown", this.handleClick, false);
  }

  close = e => {
    if (e.keyCode === 27) {
      this.setState({
        visible: false,
        share: false
      })
    }
  };

  componentWillUnmount() {
    document.removeEventListener('keydown', this.close);
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  open = e => {
    this.props.getFolders();
    this.setState({
      visible: true
    })
  };

  openTeams = e => {
    this.props.fetchTeams();
    this.setState({
      share: true,
    })
  };

  confirmShare = (unshare) => {
    this.props.confirmShare(unshare);
    debounce(()=>this.setState({
      share: false
    }), 3500);
  };

  getFolders = () => {

    let { folders = [], currentPath } = this.props;

    let matcher = new RegExp(this.state.query, "i");
    folders = [{name: 'Home', path: '/root'},...folders];
    folders = folders.filter(folder => `${folder.path}${folder.id?'/'+folder.id:''}` !== currentPath);
    if(this.state.query.length > 0) {
      return folders.filter(folder=> {
        let found = matcher.test(folder.name);
        if(found){
          return folder
        }
      })
    }
    else {
      return folders
    }
  }


  render() {
    const {
      selected, teams, showDeleteModal, selectedTeams, onSelectTeams, loading, moveAll, assetCount = 0, filters, tagAssets, selectedFolderAssets
    } = this.props;
    
    let  { folderSorted = this.getFolders(), query: folderQuery } = this.state;

    const query = filters.selected.reduce((acc, filter) => {
      if (filter.id === 'query' && filter.data.value.length > 1) {
        return filter.data.value;
      }
    });


    const isSortPrivateSelected = filters.selected.filter(flt => flt.id === 'created_time' || (flt.id === 'private' && flt.data.value === 'true'));
    const showOptions = selected.length > 0 || selectedFolderAssets.length > 0;


    const isQueryPresent = typeof query === 'string' && query.length > 0;
    const isSearchEnabled = isQueryPresent || (filters.selected.length !== isSortPrivateSelected.length)
      || filters.selected.length > 3;

    const actions = [{
      label: 'Tag',
      icon: `${appIcons.iconTag} ${styles.actionIcons}`,
      className: `${styles.action}`,
      show: showOptions && selected.length > 1 && assetCount > 0,
      onClick: tagAssets
    }, {
      label: 'Share',
      icon: `${appIcons.iconShare} ${styles.actionIcons}`,
      className: `${styles.action}`,
      show: showOptions,
      onClick: ::this.openTeams
    }, {
      label: 'Move To',
      icon: `${appIcons.iconMove} ${styles.actionIcons}`,
      className: `${styles.action}`,
      onClick: this.open,
      show: showOptions
    }, {
      label: 'Delete',
      show: showOptions && selectedFolderAssets.length < 2,
      icon: `${fontIcons.fonticonDelete} ${styles.actions}`,
      className: `${styles.action} ${styles.delete}`,
      onClick: showDeleteModal
    }];

    return <div className={isSearchEnabled && showOptions ? styles.actionNewLine : styles.actions}>
      {actions.map(action => <Action {...action}/>)}
      {this.state.visible ?
        <div ref={node => this.nodeFolder = node}
             className={`${folderStyles.container} ${styles.folders}`}>
          <div className={`${styles.header}`}>
            <h5>Choose Folder</h5>
            <Field placeholder="Search" icon value={folderQuery} theme={styles} onChange={this.onSearch} />
          </div>
          <div className={styles.items}>{loading ? <Spinner theme={styles} noOverlay/> : folderSorted.length > 0 ? folderSorted.map((folder) => {
            return <div className={folderStyles.item} onClick={moveAll.bind(null, `${folder.path}${folder.id?'/'+folder.id:''}`)}>
              <FolderIcon/>
              {folder.name}
            </div>
          })
         : <p className={styles.message}>You have no folders</p>}
        </div>
        </div> : null}
      {this.state.share ?
        <div ref={node => this.nodeTeams = node} className={`${folderStyles.container} ${styles.teams}`}>
          <div className={`${folderStyles.item} ${styles.header}`}>
            <h5>Select Teams</h5>
          </div>
          <div className={styles.teamItems}>{loading ? <Spinner theme={styles} noOverlay/> : teams.length > 0 ? teams.map((team) => {
            return <div className={folderStyles.item} onClick={onSelectTeams.bind(null, selectedTeams.indexOf(team.team_id) > -1?true:false, team.team_id, this.confirmShare)}>
              <Checkbox theme={styles} checked={selectedTeams.indexOf(team.team_id) > -1}/>{team.name}
            </div>
          }) : <p className={styles.message}>You are currently not part of any team.</p>}
          </div>
        </div> : null}
    </div>
  }

}