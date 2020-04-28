import TeamsAccordion from '../../../components/TeamsAccordion';
import { h, Component } from 'preact';
import { PrimaryButton } from '../../../components/commons/misc';
import Field from '../../../components/commons/Field';
import styles from 'stylesheets/components/teamaccordion';
import { Spinner } from "../../../components";

class Teams extends Component {

  constructor(props) {
    super(props);
    this.state = {
      create: false,
      name: '',
      meta: '',
      message: '',
      team_id: props.team_id || undefined,
      users: props.users || undefined,
      loading: false
    }
  }

  showCreateTeamForm = (team) => {
    this.setState({
      create: !this.state.create,
      team_id: undefined,
      name: '',
      meta: ''
    });
    if (team.team_id) {
      const { name, meta, team_id, users } = team;
      this.setState({ name, meta, team_id, users });
    }
  };

  onTeamDataChanged = (name, val) => {
    if (name === 'name') {
      this.setState({
        name: val
      })
    } else if (name === 'meta') {
      this.setState({
        meta: val
      })
    }
  };

  onSubmit = () => {
    const { name, meta, team_id, users } = this.state;
    const { profile: owner, createTeam, updateTeam } = this.props;

    if (name.length === 0) {
      this.setState({
        message: 'Name cannot be empty'
      })
    } else {
      if (!team_id) {
        createTeam && createTeam({
          name,
          meta,
          owner
        })
      } else {
        updateTeam && updateTeam({
          name,
          meta,
          owner,
          team_id,
          users
        })
      }

      this.setState({
        create: false
      })
    }
  };

  render() {
    const { create, name, meta, team_id } = this.state;
    const { teams = [], loading, workspace } = this.props;

    return (
      <div className={styles.teamsContainer}>
        {!loading ? teams.length > 0 && !create ? [<div className={styles.flex}>
            <h3 className={styles.head}>Teams ({teams.length})</h3>
            <PrimaryButton className={styles.purpleButton} onClick={this.showCreateTeamForm}>Create Team</PrimaryButton>
          </div>,
            <TeamsAccordion {...this.props} source={workspace.users} onSubmit={this.showCreateTeamForm}/>] :
          [teams.length > 0 ?
            <PrimaryButton className={styles.purpleButton} onClick={this.showCreateTeamForm}>Teams</PrimaryButton> : '',
            <div className={styles.team}>
              <Field label="Name" name="name" value={name} onChange={this.onTeamDataChanged.bind(null, 'name')}/>
              <Field label="Description" name="meta" value={meta} onChange={this.onTeamDataChanged.bind(null, 'meta')}/>
              {this.state.message.length > 0 ? this.state.message : ''}
              <PrimaryButton className={styles.purpleButton} onClick={this.onSubmit}>{team_id ? 'Update Team' : 'Create Team'}</PrimaryButton>
            </div>] : <Spinner theme={styles} noOverlay/>}
      </div>
    );
  }
}

export default Teams;