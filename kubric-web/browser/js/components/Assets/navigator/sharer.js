import { h } from 'preact';
import Checkbox from '../../commons/Checkbox';
import styles from 'stylesheets/components/commons/navigator';
import folderStyles from 'stylesheets/components/commons/media/action';
import { Spinner } from "../../index";

export default ({ loading, selectedTeams, confirmShare, onSelectTeams, teams, theme = {} } = props) =>
  (<div className={`${theme.container} ${theme.teamContainer} ${folderStyles.container} ${styles.teams}`}>
      <div className={`${folderStyles.item} ${styles.header}`}>
        <h5>Select Teams</h5>
      </div>
      {loading ? <Spinner theme={styles} noOverlay/> : teams.length > 0 ? teams.map((team) => {
        return <div className={folderStyles.item} onClick={onSelectTeams.bind(null, selectedTeams.indexOf(team.team_id) > -1?true:false, team.team_id, confirmShare)}>
          <Checkbox checked={selectedTeams.indexOf(team.team_id) > -1}/>{team.name}
        </div>
      }) : <p className={styles.message}>You are currently not part of any team.</p>}
    </div>
  );
