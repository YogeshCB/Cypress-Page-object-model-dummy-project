import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/media/action';
import ClickOutside from '../../../../mixins/ClickOutside';
import Sharer from '../../../../components/Assets/navigator/sharer';
import appIcon from 'stylesheets/icons/app';
import fontIcon from 'stylesheets/icons/fonticons';

const actions = [{
  name: 'View Details',
  action: 'select',
  icon: appIcon.iconInfo
},{
  name: 'Download',
  action: 'download',
  icon: fontIcon.fonticonDownload
},{
  name: 'Rename',
  action: 'rename',
  icon: fontIcon.fonticonEdit
}, {
  name: 'Share',
  action: 'share',
  icon: appIcon.iconShare
},{
  name: 'Delete',
  action: 'delete',
  icon: `${fontIcon.fonticonDelete} ${styles.deleteIcon}`
}];

export default class FolderActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTeamSelection: false
    };
    this.closeTeamSelection.bind(this);
  }

  closeTeamSelection = () => {
    this.setState({
      showTeamSelection: false
    });
  };

  render() {
    const {
      performAction,
      close: closeActions,
      view = 'tiles',
      id,
      selectedTeams,
      onSelectTeams,
      teamsLoading,
      teams,
      confirmShare,
      fetchTeams
    } = this.props;

    const ShareWithTeams = ClickOutside({
      component: Sharer,
      props: {
        theme: {
          container: styles.sharerContainer
        },
        selectedTeams,
        confirmShare: () => {
          this.closeTeamSelection();
          confirmShare();
        },
        close: this.closeTeamSelection.bind(this),
        teams,
        onSelectTeams,
        loading: teamsLoading
      }
    });

    return (
      <div>
        {this.state.showTeamSelection && (
          <div onClick={e => e.stopPropagation()}>
            <ShareWithTeams/>
          </div>
        )}
        {!this.state.showTeamSelection && (
          <div className={`${styles.container} ${view === 'list' ? styles.containerList : styles.containerTile}`}>
            {actions.map((action, index) => (
              <div key={index} className={styles.item}
                   onClick={e => {
                     e.stopPropagation();
                     if (action.action === 'share') {
                       fetchTeams();
                       this.setState({ showTeamSelection: true });
                     } else {
                       performAction(action.action, id);
                       closeActions();
                     }
                   }}>
                <span className={`${action.icon} ${styles.icons}`}></span>&nbsp;{action.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
